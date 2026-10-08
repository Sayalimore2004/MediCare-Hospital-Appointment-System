const express = require("express");

const {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  updatePrescription,
} = require("../controllers/prescriptionController");

const router = express.Router();

// Create prescription
router.post("/", createPrescription);

// Get all prescriptions
router.get("/", getAllPrescriptions);

// Get patient prescriptions
router.get("/patient/:patientId", getPatientPrescriptions);

// Get doctor prescriptions
router.get("/doctor/:doctorId", getDoctorPrescriptions);

// Update prescription
router.patch("/:prescriptionId", updatePrescription);

module.exports = router;