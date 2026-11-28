
const express = require("express");
const router = express.Router();

const {
  generateItinerary,
} = require("../controllers/aiController");

// POST /api/ai/generate-itinerary
router.post("/generate-itinerary", generateItinerary);

module.exports = router;
