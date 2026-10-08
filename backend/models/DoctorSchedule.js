const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    startTime: {
      type: String,
      default: "09:00 AM",
    },

    endTime: {
      type: String,
      default: "05:00 PM",
    },
  },
  {
    _id: false,
  }
);

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    consultationDuration: {
      type: Number,
      default: 30,
    },

    breakTime: {
      type: String,
      default: "01:00 PM",
    },

    maxPatientsPerDay: {
      type: Number,
      default: 12,
    },

    weeklySchedule: {
      type: [dayScheduleSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const DoctorSchedule =
  mongoose.model(
    "DoctorSchedule",
    doctorScheduleSchema
  );

module.exports = DoctorSchedule;