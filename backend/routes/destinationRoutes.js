
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

// Get all destinations

// Get destinations with search and filters
router.get("/", async (req, res) => {
    try {
        const { search, state, category } = req.query;

        const filter = {};

        // Search by destination name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by state
        if (state) {
            filter.state = {
                $regex: `^${state}$`,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.categories = {
                $regex: category,
                $options: "i"
            };
        }

        const destinations = await Destination.find(filter);

        res.status(200).json({
            success: true,
            count: destinations.length,
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
