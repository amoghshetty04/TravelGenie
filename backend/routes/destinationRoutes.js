
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
router.get("/", async (req, res) => {
    try {
        const destinations = await Destination.find();

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
