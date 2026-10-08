const express = require("express");

const {
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
} = require("../controllers/doctorController");

const router = express.Router();


/* =========================
   DOCTOR LOGIN
========================= */

router.post(
  "/login",
  doctorLogin
);


/* =========================
   DOCTOR LOGOUT
========================= */

router.post(
  "/logout",
  doctorLogout
);


/* =========================
   GET ALL DOCTORS
========================= */

router.get(
  "/",
  getAllDoctors
);


/* =========================
   CREATE DOCTOR
========================= */

router.post(
  "/",
  createDoctor
);


/* =========================
   GET DOCTOR BY ID
========================= */

router.get(
  "/:doctorId",
  getDoctorById
);


/* =========================
   UPDATE DOCTOR ACCESS
========================= */

router.patch(
  "/:doctorId/access",
  updateDoctorAccess
);


/* =========================
   RESET DOCTOR PASSWORD
========================= */

router.patch(
  "/:doctorId/reset-password",
  resetDoctorPassword
);


/* =========================
   ADMIN UPDATE DOCTOR
========================= */

router.patch(
  "/:doctorId",
  adminUpdateDoctor
);


/* =========================
   GET DOCTOR PROFILE
========================= */

router.get(
  "/:doctorId/profile",
  getMyProfile
);


/* =========================
   UPDATE DOCTOR PROFILE
========================= */

router.patch(
  "/:doctorId/profile",
  updateMyProfile
);


module.exports = router;