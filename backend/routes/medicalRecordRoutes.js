const express = require("express");

const {
  createMedicalRecord,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
  getAllMedicalRecords,
  updateMedicalRecord,
} = require("../controllers/medicalRecordController");

const router = express.Router();


// Create a medical record
router.post("/", createMedicalRecord);


// Get all medical records
router.get("/", getAllMedicalRecords);


// Get medical records for a patient
router.get("/patient/:patientId", getPatientMedicalRecords);


// Get medical records for a doctor
router.get("/doctor/:doctorId", getDoctorMedicalRecords);


// Update a medical record
router.patch("/:recordId", updateMedicalRecord);


module.exports = router;
