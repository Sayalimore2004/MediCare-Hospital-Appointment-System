const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} = require("../controllers/departmentController");

const router = express.Router();


/* =========================================
   CREATE DEPARTMENT
========================================= */

router.post(
  "/",
  createDepartment
);


/* =========================================
   GET ALL DEPARTMENTS
========================================= */

router.get(
  "/",
  getAllDepartments
);


/* =========================================
   GET DEPARTMENT BY ID
========================================= */

router.get(
  "/:departmentId",
  getDepartmentById
);


/* =========================================
   UPDATE DEPARTMENT
========================================= */

router.put(
  "/:departmentId",
  updateDepartment
);


module.exports = router;