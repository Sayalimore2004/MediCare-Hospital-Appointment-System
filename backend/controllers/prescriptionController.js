const Prescription = require("../models/Prescription");

// Create a new prescription
const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      appointmentId,
      department,
      diagnosis,
      medicines,
      additionalInstructions,
      prescriptionDate,
      status,
    } = req.body;

    // Validate required fields
    if (
      !patientId ||
      !patientName ||
      !doctorId ||
      !doctorName ||
      !department ||
      !diagnosis ||
      !medicines ||
      !medicines.length ||
      !prescriptionDate
    ) {
      return res.status(400).json({
        message: "Please provide all required prescription details",
      });
    }

    // Generate prescription ID
    const prescriptionCount = await Prescription.countDocuments();

    const prescriptionId = `RX${1001 + prescriptionCount}`;

    const prescription = new Prescription({
      prescriptionId,
      patientId,
      patientName,
      doctorId,
      doctorName,
      appointmentId: appointmentId || "",
      department,
      diagnosis,
      medicines,
      additionalInstructions: additionalInstructions || "",
      prescriptionDate,
      status: status || "Active",
    });

    const savedPrescription = await prescription.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: savedPrescription,
    });
  } catch (error) {
    console.error("Create prescription error:", error);

    res.status(500).json({
      message: "Failed to create prescription",
      error: error.message,
    });
  }
};


// Get prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({
      patientId,
    }).sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Get patient prescriptions error:", error);

    res.status(500).json({
      message: "Failed to fetch patient prescriptions",
      error: error.message,
    });
  }
};


// Get prescriptions for a doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const prescriptions = await Prescription.find({
      doctorId,
    }).sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor prescriptions",
      error: error.message,
    });
  }
};


// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({
      createdAt: -1,
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Get all prescriptions error:", error);

    res.status(500).json({
      message: "Failed to fetch prescriptions",
      error: error.message,
    });
  }
};


// Update a prescription
const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const updatedPrescription = await Prescription.findOneAndUpdate(
      { prescriptionId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPrescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription updated successfully",
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error("Update prescription error:", error);

    res.status(500).json({
      message: "Failed to update prescription",
      error: error.message,
    });
  }
};


module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  updatePrescription,
};