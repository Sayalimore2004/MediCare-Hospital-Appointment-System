const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    patientId: {
      type: String,
      required: true,
      trim: true
    },

    patientName: {
      type: String,
      required: true,
      trim: true
    },

    doctorId: {
      type: String,
      required: true,
      trim: true
    },

    doctorName: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    appointmentDate: {
      type: String,
      required: true,
      trim: true
    },

    appointmentTime: {
      type: String,
      required: true,
      trim: true
    },

    reason: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Rejected"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

module.exports = Appointment;