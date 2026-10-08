const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    qualification: {
      type: String,
      required: true,
      trim: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: String,
      required: true,
      trim: true
    },

    consultationFee: {
      type: Number,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active"
    },

    accountAccess: {
      type: String,
      enum: ["Enabled", "Disabled"],
      default: "Enabled"
    },

    /* ONLINE STATUS */

    isOnline: {
      type: Boolean,
      default: false
    },

    lastActiveAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;