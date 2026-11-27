
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function AttractionsMap({ latitude, longitude, radius = 5000 }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/osm/attractions?lat=${latitude}&lon=${longitude}&radius=${radius}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attractions");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Unable to load attractions");
        }

        setAttractions(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [latitude, longitude, radius]);

  return (
    <div className="attractions-map-section">
      <h2>Nearby Attractions</h2>

      {loading && <p>Loading attractions...</p>}

      {error && <p className="map-error">{error}</p>}

      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {attractions.map((place) => (
          <CircleMarker
            key={`${place.osmType}-${place.osmId}`}
            center={[place.latitude, place.longitude]}
            radius={7}
            pathOptions={{
              color: "#16834a",
              fillColor: "#28a765",
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <strong>{place.name || "Unnamed attraction"}</strong>
              <br />
              Category: {place.category}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {!loading && !error && (
        <p>Found {attractions.length} nearby attractions.</p>
      )}

      <p className="map-attribution">
        Attraction data: © OpenStreetMap contributors (ODbL).
      </p>
    </div>
  );
}

export default AttractionsMap;
