const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Patient information
    patientId: {
      type: String,
      trim: true,
      default: "",
    },

    patientName: {
      type: String,
      trim: true,
      default: "",
    },

    // Doctor information
    doctorId: {
      type: String,
      trim: true,
      default: "",
    },

    doctorName: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "Appointment",
        "Prescription",
        "Medical Record",
        "Billing",
        "System",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    relatedId: {
      type: String,
      trim: true,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    notificationDate: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;