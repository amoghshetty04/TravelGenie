
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TravelGenie API is running!",
        version: "1.0.0"
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`TravelGenie server running on port ${PORT}`);
});
