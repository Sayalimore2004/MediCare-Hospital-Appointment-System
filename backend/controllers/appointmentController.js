const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

/* CREATE APPOINTMENT */

const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    if (
      !patientId ||
      !patientName ||
      !doctorId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        message:
          "Patient, doctor, date and time are required.",
      });
    }

    /* FIND DOCTOR */

    const doctor = await Doctor.findOne({
      doctorId,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    /* CHECK DOCTOR ACCESS */

    if (doctor.accountAccess === "Disabled") {
      return res.status(403).json({
        message:
          "This doctor is currently unavailable.",
      });
    }

    if (doctor.status !== "Active") {
      return res.status(403).json({
        message:
          "This doctor is currently inactive.",
      });
    }

    /* CHECK DUPLICATE TIME SLOT */

    const existingAppointment =
      await Appointment.findOne({
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          $in: ["Pending", "Confirmed"],
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        message:
          "This time slot is already booked for this doctor.",
      });
    }

    /* GENERATE APPOINTMENT ID */

    const appointmentCount =
      await Appointment.countDocuments();

    const appointmentId =
      `APT${1001 + appointmentCount}`;

    /* CREATE APPOINTMENT */

    const appointment =
      await Appointment.create({
        appointmentId,
        patientId,
        patientName,
        doctorId,
        doctorName: doctor.name,
        department: doctor.department,
        appointmentDate,
        appointmentTime,
        reason: reason || "",
        status: "Pending",
      });

    res.status(201).json({
      message:
        "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error(
      "Create appointment error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to book appointment.",
    });
  }
};

/* GET APPOINTMENTS BY PATIENT */

const getPatientAppointments = async (
  req,
  res
) => {
  try {
    const appointments =
      await Appointment.find({
        patientId: req.params.patientId,
      }).sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    res.json(appointments);
  } catch (error) {
    console.error(
      "Get patient appointments error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch patient appointments.",
    });
  }
};

/* GET APPOINTMENTS BY DOCTOR */

const getDoctorAppointments = async (
  req,
  res
) => {
  try {
    const appointments =
      await Appointment.find({
        doctorId: req.params.doctorId,
      }).sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    res.json(appointments);
  } catch (error) {
    console.error(
      "Get doctor appointments error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch doctor appointments.",
    });
  }
};

/* UPDATE APPOINTMENT STATUS */

const updateAppointmentStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid appointment status.",
      });
    }

    const appointment =
      await Appointment.findOne({
        appointmentId:
          req.params.appointmentId,
      });

    if (!appointment) {
      return res.status(404).json({
        message:
          "Appointment not found.",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.json({
      message:
        "Appointment status updated successfully.",
      appointment,
    });
  } catch (error) {
    console.error(
      "Update appointment status error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to update appointment status.",
    });
  }
};

/* GET ALL APPOINTMENTS */

const getAllAppointments = async (
  req,
  res
) => {
  try {
    const appointments =
      await Appointment.find().sort({
        createdAt: -1,
      });

    res.json(appointments);
  } catch (error) {
    console.error(
      "Get all appointments error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch appointments.",
    });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
};