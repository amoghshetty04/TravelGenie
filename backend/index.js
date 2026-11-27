
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const osmRoutes = require("./routes/osmRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/destinations", destinationRoutes);
app.use("/api/osm", osmRoutes);
// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TravelGenie API is running!",
        version: "1.0.0"
    });
});

// Start server after database connection
const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`TravelGenie server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
