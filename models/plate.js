const mongoose = require('mongoose');

const PlateSchema = new mongoose.Schema({
  plateText: String,
  imageName: String,
  extraName: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plate', PlateSchema);