const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
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

    dateOfBirth: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
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

const Patient = mongoose.model(
  "Patient",
  patientSchema
);

module.exports = Patient;