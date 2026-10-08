const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   GENERATE READABLE RANDOM PASSWORD
========================= */

const generatePassword = () => {
  const randomNumber = Math.floor(
    1000 + Math.random() * 9000
  );

  return `medcare@${randomNumber}`;
};

/* =========================
   CREATE DOCTOR
========================= */

const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      qualification,
      specialization,
      department,
      experience,
      consultationFee
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !qualification ||
      !specialization ||
      !department ||
      !experience ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        message: "All doctor fields are required."
      });
    }

    const existingDoctor = await Doctor.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingDoctor) {
      return res.status(409).json({
        message: "A doctor with this email already exists."
      });
    }

    const doctorCount = await Doctor.countDocuments();

    const doctorId = `DR${1001 + doctorCount}`;

    const temporaryPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    const doctor = await Doctor.create({
      doctorId,
      name,
      email: email.trim().toLowerCase(),
      phone,
      gender,
      qualification,
      specialization,
      department,
      experience,
      consultationFee,
      password: hashedPassword,
      status: "Active",
      accountAccess: "Enabled",
      isOnline: false,
      lastActiveAt: null
    });

    res.status(201).json({
      message: "Doctor created successfully.",
      doctor: {
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        status: doctor.status,
        accountAccess: doctor.accountAccess,
        isOnline: doctor.isOnline
      },
      temporaryPassword
    });
  } catch (error) {
    console.error(
      "Create doctor error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create doctor."
    });
  }
};

/* =========================
   GET ALL DOCTORS
========================= */

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(doctors);
  } catch (error) {
    console.error(
      "Get all doctors error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch doctors."
    });
  }
};

/* =========================
   GET DOCTOR BY ID
========================= */

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(
      "Get doctor error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch doctor."
    });
  }
};

/* =========================
   UPDATE DOCTOR ACCESS
========================= */

const updateDoctorAccess = async (req, res) => {
  try {
    const { accountAccess } = req.body;

    if (
      !["Enabled", "Disabled"].includes(accountAccess)
    ) {
      return res.status(400).json({
        message: "Invalid account access value."
      });
    }

    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    doctor.accountAccess = accountAccess;

    if (accountAccess === "Disabled") {
      doctor.isOnline = false;
    }

    await doctor.save();

    res.status(200).json({
      message: "Doctor access updated successfully.",
      doctor: {
        doctorId: doctor.doctorId,
        accountAccess: doctor.accountAccess,
        isOnline: doctor.isOnline
      }
    });
  } catch (error) {
    console.error(
      "Update doctor access error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update doctor access."
    });
  }
};

/* =========================
   RESET DOCTOR PASSWORD
========================= */

const resetDoctorPassword = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    const temporaryPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    doctor.password = hashedPassword;

    await doctor.save();

    res.status(200).json({
      message: "Doctor password reset successfully.",
      temporaryPassword
    });
  } catch (error) {
    console.error(
      "Reset doctor password error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to reset doctor password."
    });
  }
};

/* =========================
   ADMIN UPDATE DOCTOR
========================= */

const adminUpdateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    const {
      name,
      email,
      phone,
      gender,
      qualification,
      specialization,
      department,
      experience,
      consultationFee,
      status
    } = req.body;

    if (name !== undefined)
      doctor.name = name;

    if (email !== undefined)
      doctor.email = email.trim().toLowerCase();

    if (phone !== undefined)
      doctor.phone = phone;

    if (gender !== undefined)
      doctor.gender = gender;

    if (qualification !== undefined)
      doctor.qualification = qualification;

    if (specialization !== undefined)
      doctor.specialization = specialization;

    if (department !== undefined)
      doctor.department = department;

    if (experience !== undefined)
      doctor.experience = experience;

    if (consultationFee !== undefined)
      doctor.consultationFee = consultationFee;

    if (status !== undefined)
      doctor.status = status;

    if (status === "Inactive") {
      doctor.isOnline = false;
    }

    await doctor.save();

    res.status(200).json({
      message: "Doctor updated successfully.",
      doctor: {
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        status: doctor.status,
        accountAccess: doctor.accountAccess,
        isOnline: doctor.isOnline,
        lastActiveAt: doctor.lastActiveAt
      }
    });
  } catch (error) {
    console.error(
      "Admin update doctor error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update doctor."
    });
  }
};

/* =========================
   DOCTOR LOGIN
========================= */

const doctorLogin = async (req, res) => {
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

    const doctor = await Doctor.findOne({
      email: email.trim().toLowerCase()
    });

    if (!doctor) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (doctor.status !== "Active") {
      return res.status(403).json({
        message: "Your doctor account is inactive."
      });
    }

    if (doctor.accountAccess !== "Enabled") {
      return res.status(403).json({
        message: "Doctor login access is disabled."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    /* MARK DOCTOR AS ONLINE */

    doctor.isOnline = true;
    doctor.lastActiveAt = new Date();

    await doctor.save();

    const token = jwt.sign(
      {
        doctorId: doctor.doctorId,
        email: doctor.email
      },
      process.env.JWT_SECRET ||
        "medicare-secret-key",
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      message: "Doctor login successful.",
      token,
      doctor: {
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        status: doctor.status,
        accountAccess: doctor.accountAccess,
        isOnline: doctor.isOnline,
        lastActiveAt: doctor.lastActiveAt
      }
    });
  } catch (error) {
    console.error(
      "Doctor login error:",
      error.message
    );

    res.status(500).json({
      message: "Doctor login failed."
    });
  }
};

/* =========================
   DOCTOR LOGOUT
========================= */

const doctorLogout = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor ID is required."
      });
    }

    const doctor = await Doctor.findOne({
      doctorId
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    doctor.isOnline = false;
    doctor.lastActiveAt = new Date();

    await doctor.save();

    res.status(200).json({
      message: "Doctor logged out successfully."
    });
  } catch (error) {
    console.error(
      "Doctor logout error:",
      error.message
    );

    res.status(500).json({
      message: "Doctor logout failed."
    });
  }
};

/* =========================
   GET MY PROFILE
========================= */

const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(
      "Get doctor profile error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch doctor profile."
    });
  }
};

/* =========================
   UPDATE MY PROFILE
========================= */

const updateMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      doctorId: req.params.doctorId
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found."
      });
    }

    const {
      name,
      phone,
      gender,
      qualification,
      specialization,
      experience
    } = req.body;

    if (name !== undefined)
      doctor.name = name;

    if (phone !== undefined)
      doctor.phone = phone;

    if (gender !== undefined)
      doctor.gender = gender;

    if (qualification !== undefined)
      doctor.qualification = qualification;

    if (specialization !== undefined)
      doctor.specialization = specialization;

    if (experience !== undefined)
      doctor.experience = experience;

    await doctor.save();

    res.status(200).json({
      message: "Doctor profile updated successfully.",
      doctor: {
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        status: doctor.status,
        accountAccess: doctor.accountAccess,
        isOnline: doctor.isOnline,
        lastActiveAt: doctor.lastActiveAt
      }
    });
  } catch (error) {
    console.error(
      "Update doctor profile error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update doctor profile."
    });
  }
};

module.exports = {
  generatePassword,
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorAccess,
  resetDoctorPassword,
  adminUpdateDoctor,
  doctorLogin,
  doctorLogout,
  getMyProfile,
  updateMyProfile
};