const express = require("express");

const {
  registerPatient,
  loginPatient,
  logoutPatient,
  getAllPatients
} = require("../controllers/patientController");

const router = express.Router();


/* GET ALL PATIENTS */

router.get(
  "/",
  getAllPatients
);


/* REGISTER PATIENT */

router.post(
  "/register",
  registerPatient
);


/* PATIENT LOGIN */

router.post(
  "/login",
  loginPatient
);


/* PATIENT LOGOUT */

router.post(
  "/logout",
  logoutPatient
);


module.exports = router;