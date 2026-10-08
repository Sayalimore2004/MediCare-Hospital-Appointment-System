const DoctorSchedule = require("../models/DoctorSchedule");

const defaultWeeklySchedule = [
  {
    day: "Monday",
    isAvailable: true,
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    day: "Tuesday",
    isAvailable: true,
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    day: "Wednesday",
    isAvailable: true,
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    day: "Thursday",
    isAvailable: true,
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    day: "Friday",
    isAvailable: true,
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    day: "Saturday",
    isAvailable: false,
    startTime: "",
    endTime: "",
  },
  {
    day: "Sunday",
    isAvailable: false,
    startTime: "",
    endTime: "",
  },
];


// GET DOCTOR SCHEDULE
const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;

    let schedule =
      await DoctorSchedule.findOne({
        doctorId,
      });

    // Create default schedule automatically
    // if the doctor does not have one yet.
    if (!schedule) {
      schedule =
        await DoctorSchedule.create({
          doctorId,
          consultationDuration: 30,
          breakTime: "01:00 PM",
          maxPatientsPerDay: 12,
          weeklySchedule:
            defaultWeeklySchedule,
        });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error(
      "Get doctor schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch doctor schedule",
      error: error.message,
    });
  }
};


// UPDATE DOCTOR SCHEDULE
const updateDoctorSchedule = async (
  req,
  res
) => {
  try {
    const { doctorId } = req.params;

    const {
      consultationDuration,
      breakTime,
      maxPatientsPerDay,
      weeklySchedule,
    } = req.body;

    if (
      consultationDuration === undefined ||
      breakTime === undefined ||
      maxPatientsPerDay === undefined ||
      !Array.isArray(weeklySchedule)
    ) {
      return res.status(400).json({
        message:
          "consultationDuration, breakTime, maxPatientsPerDay and weeklySchedule are required",
      });
    }

    const schedule =
      await DoctorSchedule.findOneAndUpdate(
        { doctorId },
        {
          consultationDuration,
          breakTime,
          maxPatientsPerDay,
          weeklySchedule,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      message:
        "Doctor schedule updated successfully",
      schedule,
    });
  } catch (error) {
    console.error(
      "Update doctor schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update doctor schedule",
      error: error.message,
    });
  }
};


module.exports = {
  getDoctorSchedule,
  updateDoctorSchedule,
};