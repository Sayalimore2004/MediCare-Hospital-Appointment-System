const express = require("express");

const {
  getDoctorSchedule,
  updateDoctorSchedule,
} = require("../controllers/doctorScheduleController");

const router = express.Router();


// Get doctor's schedule
router.get(
  "/:doctorId",
  getDoctorSchedule
);


// Update doctor's schedule
router.patch(
  "/:doctorId",
  updateDoctorSchedule
);


module.exports = router;