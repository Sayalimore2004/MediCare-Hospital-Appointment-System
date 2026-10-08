const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 5,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Clinical", "Diagnostic", "Support"],
      required: true,
    },

    availability: {
      type: String,
      enum: ["Available", "Limited", "Unavailable"],
      default: "Available",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model(
  "Department",
  departmentSchema
);

module.exports = Department;