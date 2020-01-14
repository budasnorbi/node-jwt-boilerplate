const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "sportoló",
      required: true
    },
    subscription: {
      type: String,
      required: false
    },
    reserveCount: {
      type: Number,
      required: false
    }
  },
  { versionKey: false }
);

userSchema.statics.findByEmail = async email => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return false;
    }

    return true;
  } catch (err) {
    return err;
  }
};

module.exports = User = mongoose.model("users", userSchema);
