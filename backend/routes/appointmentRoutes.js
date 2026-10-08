const express = require("express");

const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
} = require("../controllers/appointmentController");

const router = express.Router();

/* CREATE APPOINTMENT */

router.post(
  "/",
  createAppointment
);

/* GET ALL APPOINTMENTS */

router.get(
  "/",
  getAllAppointments
);

/* GET PATIENT APPOINTMENTS */

router.get(
  "/patient/:patientId",
  getPatientAppointments
);

/* GET DOCTOR APPOINTMENTS */

router.get(
  "/doctor/:doctorId",
  getDoctorAppointments
);

/* UPDATE APPOINTMENT STATUS */

router.patch(
  "/:appointmentId/status",
  updateAppointmentStatus
);

module.exports = router;