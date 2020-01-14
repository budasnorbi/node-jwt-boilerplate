const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  capacity: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  startTime: {
    type: Date.now,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

module.exports = Event = mongoose.model("events", UserSchema);
