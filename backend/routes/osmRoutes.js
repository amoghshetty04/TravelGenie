
const express = require("express");
const router = express.Router();

const OSMCache = require("../models/OSMCache");

// GET tourist attractions
router.get("/attractions", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const radius = parseInt(req.query.radius, 10) || 5000;

    // Validate coordinates
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required."
      });
    }

    // Validate radius
    if (radius < 1000 || radius > 10000) {
      return res.status(400).json({
        success: false,
        message: "Radius must be between 1000 and 10000 metres."
      });
    }

    // Round coordinates for cache reuse
    const roundedLat = Number(lat.toFixed(3));
    const roundedLon = Number(lon.toFixed(3));

    const cacheKey = `${roundedLat}_${roundedLon}_${radius}`;

    // Check MongoDB cache
    const cachedData = await OSMCache.findOne({
      cacheKey,
      expiresAt: { $gt: new Date() }
    });

    if (cachedData) {
      console.log("Returning attractions from MongoDB cache");

      return res.status(200).json({
        success: true,
        cached: true,
        count: cachedData.attractions.length,
        attribution: "© OpenStreetMap contributors",
        license: "Open Database License (ODbL)",
        data: cachedData.attractions
      });
    }

    console.log("Fetching attractions from OpenStreetMap...");

    // Overpass query
    const query = `
      [out:json][timeout:20];
      (
        nwr(around:${radius},${lat},${lon})["tourism"~"^(attraction|museum|viewpoint)$"];
        nwr(around:${radius},${lat},${lon})["historic"];
      );
      out center tags;
    `;

    // Fetch from working Overpass provider
    const response = await fetch(
      "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          "User-Agent": "TravelGenie/1.0 (Student Tourism Project)"
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(60000)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Overpass HTTP Error:", response.status, errorText);

      return res.status(502).json({
        success: false,
        message: `OpenStreetMap provider returned HTTP ${response.status}.`
      });
    }

    const result = await response.json();

    if (result.remark) {
      throw new Error(result.remark);
    }

    // Normalize OSM elements
    const attractions = result.elements
      .filter((place) => place.tags?.name)
      .map((place) => {
        const latitude = place.lat ?? place.center?.lat;
        const longitude = place.lon ?? place.center?.lon;

        if (latitude == null || longitude == null) {
          return null;
        }

        return {
          name: place.tags.name,
          category:
            place.tags.tourism ||
            place.tags.historic ||
            "attraction",
          latitude,
          longitude,
          osmType: place.type,
          osmId: place.id,
          tags: place.tags
        };
      })
      .filter(Boolean);

    // Save results in MongoDB for 24 hours
    const fetchedAt = new Date();

    const expiresAt = new Date(
      fetchedAt.getTime() + 24 * 60 * 60 * 1000
    );

    await OSMCache.findOneAndUpdate(
      { cacheKey },
      {
        cacheKey,
        latitude: roundedLat,
        longitude: roundedLon,
        radius,
        attractions,
        fetchedAt,
        expiresAt
      },
      {
        upsert: true,
        returnDocument: "after",
         runValidators: true
      }
    );

    console.log(`Found ${attractions.length} attractions.`);
    console.log("Attractions saved in MongoDB cache.");

    return res.status(200).json({
      success: true,
      cached: false,
      count: attractions.length,
      attribution: "© OpenStreetMap contributors",
      license: "Open Database License (ODbL)",
      data: attractions
    });

  } catch (error) {
    console.error("OSM API Error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to retrieve attractions from OpenStreetMap.",
      error: error.message
    });
  }
});

module.exports = router;
