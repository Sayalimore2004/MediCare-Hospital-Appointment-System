const MedicalRecord = require("../models/MedicalRecord");

// ==========================================
// CREATE MEDICAL RECORD
// ==========================================

const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      appointmentId,
      department,
      diagnosis,
      recordType,
      notes,
      visitDate,
      status,
    } = req.body;

    if (
      !patientId ||
      !patientName ||
      !doctorId ||
      !doctorName ||
      !department ||
      !diagnosis ||
      !notes ||
      !visitDate
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const recordCount = await MedicalRecord.countDocuments();

    const recordId = `MR${1001 + recordCount}`;

    const medicalRecord = new MedicalRecord({
      recordId,
      patientId,
      patientName,
      doctorId,
      doctorName,
      appointmentId: appointmentId || "",
      department,
      diagnosis,
      recordType: recordType || "Consultation",
      notes,
      visitDate,
      status: status || "Completed",
    });

    const savedRecord = await medicalRecord.save();

    res.status(201).json({
      message: "Medical record created successfully.",
      record: savedRecord,
    });
  } catch (error) {
    console.error("Create Medical Record Error:", error);

    res.status(500).json({
      message: "Server error while creating medical record.",
      error: error.message,
    });
  }
};


// ==========================================
// GET PATIENT MEDICAL RECORDS
// ==========================================

const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({
      patientId,
    }).sort({
      visitDate: -1,
      createdAt: -1,
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Get Patient Medical Records Error:", error);

    res.status(500).json({
      message: "Server error while fetching patient medical records.",
      error: error.message,
    });
  }
};


// ==========================================
// GET DOCTOR MEDICAL RECORDS
// ==========================================

const getDoctorMedicalRecords = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const records = await MedicalRecord.find({
      doctorId,
    }).sort({
      visitDate: -1,
      createdAt: -1,
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Get Doctor Medical Records Error:", error);

    res.status(500).json({
      message: "Server error while fetching doctor medical records.",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL MEDICAL RECORDS
// ==========================================

const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find().sort({
      createdAt: -1,
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Get All Medical Records Error:", error);

    res.status(500).json({
      message: "Server error while fetching medical records.",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE MEDICAL RECORD
// ==========================================

const updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const updatedRecord = await MedicalRecord.findOneAndUpdate(
      { recordId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRecord) {
      return res.status(404).json({
        message: "Medical record not found.",
      });
    }

    res.status(200).json({
      message: "Medical record updated successfully.",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Update Medical Record Error:", error);

    res.status(500).json({
      message: "Server error while updating medical record.",
      error: error.message,
    });
  }
};


module.exports = {
  createMedicalRecord,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
  getAllMedicalRecords,
  updateMedicalRecord,
};