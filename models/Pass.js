const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PassSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0,
      required: true
    }
  },
  { versionKey: false }
);

module.exports = Pass = mongoose.model("passes", PassSchema);
