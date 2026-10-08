const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    patientId: {
      type: String,
      required: true,
      trim: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    doctorId: {
      type: String,
      required: true,
      trim: true,
    },

    doctorName: {
      type: String,
      required: true,
      trim: true,
    },

    appointmentId: {
      type: String,
      trim: true,
      default: "",
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    recordType: {
      type: String,
      enum: [
        "Consultation",
        "Follow-up",
        "Review",
        "Emergency",
        "Test Report",
      ],
      default: "Consultation",
    },

    notes: {
      type: String,
      required: true,
      trim: true,
    },

    visitDate: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

module.exports = MedicalRecord;