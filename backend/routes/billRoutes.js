const express = require("express");

const {
  createBill,
  getAllBills,
  getPatientBills,
  getBillById,
  updatePaymentStatus,
} = require("../controllers/billController");

const router = express.Router();

// Create a bill
router.post("/", createBill);

// Get all bills
router.get("/", getAllBills);

// Get bills for a patient
router.get("/patient/:patientId", getPatientBills);

// Get one bill
router.get("/:billId", getBillById);

// Update payment status
router.patch("/:billId/payment", updatePaymentStatus);

module.exports = router;