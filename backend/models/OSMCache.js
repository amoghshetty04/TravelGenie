
const mongoose = require("mongoose");

const OSMCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true
  },

  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  },

  radius: {
    type: Number,
    required: true
  },

  attractions: [
    {
      name: String,
      category: String,
      latitude: Number,
      longitude: Number,
      osmType: String,
      osmId: Number,
      tags: mongoose.Schema.Types.Mixed
    }
  ],

  fetchedAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: {
    type: Date,
    required: true,
    index: {
      expireAfterSeconds: 0
    }
  }

});

module.exports = mongoose.model("OSMCache", OSMCacheSchema);
