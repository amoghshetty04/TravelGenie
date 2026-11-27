
const express = require("express");
const router = express.Router();

const Destination = require("../models/Destination");

// Add a new destination
router.post("/", async (req, res) => {
    try {
        const destination = await Destination.create(req.body);

        res.status(201).json({
            success: true,
            message: "Destination added successfully!",
            data: destination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update a destination
router.patch("/:id", async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedDestination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: updatedDestination
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all destinations

// Get destinations with search and filters

router.get("/", async (req, res) => {
    try {
        const { search, state, category } = req.query;

        // Pagination
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit) || 10)
        );

        const skip = (page - 1) * limit;

        // Sorting
        const allowedSortFields = ["name", "state", "createdAt"];
        const sortField = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : "createdAt";

        const sortOrder = req.query.order === "desc" ? -1 : 1;

        // Search and filters
        const filter = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (state) {
            filter.state = {
                $regex: `^${state}$`,
                $options: "i"
            };
        }

        if (category) {
            filter.categories = {
                $regex: category,
                $options: "i"
            };
        }

        // Fetch destinations
        const destinations = await Destination.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await Destination.countDocuments(filter);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: destinations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



module.exports = router;
