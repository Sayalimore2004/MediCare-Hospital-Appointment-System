const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");

/* REGISTER PATIENT */

const registerPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      password
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const existingPatient = await Patient.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingPatient) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const patientCount = await Patient.countDocuments();

    const patientId = `PAT${1001 + patientCount}`;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const patient = await Patient.create({
      patientId,
      name,
      email: email.trim().toLowerCase(),
      phone,
      dateOfBirth,
      password: hashedPassword,
      status: "Active",
      isOnline: false,
      lastActiveAt: null
    });

    res.status(201).json({
      message: "Patient account created successfully.",
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        status: patient.status,
        isOnline: patient.isOnline,
        lastActiveAt: patient.lastActiveAt
      }
    });
  } catch (error) {
    console.error(
      "Register patient error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create patient account."
    });
  }
};


/* PATIENT LOGIN */

const loginPatient = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const patient = await Patient.findOne({
      email: email.trim().toLowerCase()
    });

    if (!patient) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (patient.status !== "Active") {
      return res.status(403).json({
        message: "Your patient account is inactive."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      patient.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    /* MARK PATIENT AS ONLINE */

    patient.isOnline = true;
    patient.lastActiveAt = new Date();

    await patient.save();

    res.json({
      message: "Patient login successful.",
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        status: patient.status,
        isOnline: patient.isOnline,
        lastActiveAt: patient.lastActiveAt
      }
    });
  } catch (error) {
    console.error(
      "Patient login error:",
      error.message
    );

    res.status(500).json({
      message: "Patient login failed."
    });
  }
};


/* PATIENT LOGOUT */

const logoutPatient = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required."
      });
    }

    const patient = await Patient.findOne({
      patientId
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found."
      });
    }

    patient.isOnline = false;
    patient.lastActiveAt = new Date();

    await patient.save();

    res.status(200).json({
      message: "Patient logged out successfully."
    });
  } catch (error) {
    console.error(
      "Patient logout error:",
      error.message
    );

    res.status(500).json({
      message: "Patient logout failed."
    });
  }
};


/* GET ALL PATIENTS */

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error(
      "Get all patients error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch patients."
    });
  }
};


module.exports = {
  registerPatient,
  loginPatient,
  logoutPatient,
  getAllPatients
};