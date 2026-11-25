
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        district: {
            type: String,
            trim: true
        },

        description: {
            type: String
        },

        categories: [{
            type: String
        }],

        imageUrl: {
            type: String
        },

        // GeoJSON location: [longitude, latitude]
        location: {
            type: {
                type: String,
                enum: ["Point"]
            },
            coordinates: {
                type: [Number],
                validate: {
                    validator: function (value) {
                        return !value || value.length === 2;
                    },
                    message: "Coordinates must contain longitude and latitude."
                }
            }
        },

        // Track where destination information came from
        source: {
            name: String,
            url: String,
            externalId: String,
            license: String
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Enable geographical searches
destinationSchema.index({ location: "2dsphere" });

const Destination = mongoose.model(
    "Destination",
    destinationSchema
);

module.exports = Destination;
