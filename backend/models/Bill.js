const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    billId: {
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

    appointmentId: {
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

    department: {
      type: String,
      required: true,
      trim: true,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    additionalCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Cash", "Net Banking"],
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    billDate: {
      type: String,
      required: true,
      trim: true,
    },

    paymentDate: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;