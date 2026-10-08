const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
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

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
          trim: true,
        },

        dosage: {
          type: String,
          required: true,
          trim: true,
        },

        frequency: {
          type: String,
          required: true,
          trim: true,
        },

        duration: {
          type: String,
          required: true,
          trim: true,
        },

        instructions: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    additionalInstructions: {
      type: String,
      trim: true,
      default: "",
    },

    prescriptionDate: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;