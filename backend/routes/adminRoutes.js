const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);

module.exports = router;