const Department = require("../models/Department");

/* =========================================
   CREATE DEPARTMENT
========================================= */

const createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      type,
      availability,
      status,
    } = req.body;

    if (
      !name ||
      !code ||
      !description ||
      !type ||
      !availability ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Please provide all required department details.",
      });
    }

    const existingDepartment =
      await Department.findOne({
        $or: [
          { name: name.trim() },
          { code: code.trim().toUpperCase() },
        ],
      });

    if (existingDepartment) {
      return res.status(409).json({
        message:
          "A department with this name or code already exists.",
      });
    }

    const departmentCount =
      await Department.countDocuments();

    const departmentId =
      `DEP${1001 + departmentCount}`;

    const department =
      await Department.create({
        departmentId,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        type,
        availability,
        status,
      });

    res.status(201).json({
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    console.error(
      "Create department error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create department.",
    });
  }
};


/* =========================================
   GET ALL DEPARTMENTS
========================================= */

const getAllDepartments = async (req, res) => {
  try {
    const departments =
      await Department.find().sort({
        createdAt: 1,
      });

    res.json(departments);
  } catch (error) {
    console.error(
      "Get departments error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch departments.",
    });
  }
};


/* =========================================
   GET DEPARTMENT BY ID
========================================= */

const getDepartmentById = async (req, res) => {
  try {
    const department =
      await Department.findOne({
        departmentId: req.params.departmentId,
      });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.json(department);
  } catch (error) {
    console.error(
      "Get department error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch department.",
    });
  }
};


/* =========================================
   UPDATE DEPARTMENT
========================================= */

const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      type,
      availability,
      status,
    } = req.body;

    const department =
      await Department.findOne({
        departmentId: req.params.departmentId,
      });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    if (
      !name ||
      !code ||
      !description ||
      !type ||
      !availability ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Please provide all required department details.",
      });
    }

    const existingDepartment =
      await Department.findOne({
        $and: [
          {
            _id: {
              $ne: department._id,
            },
          },
          {
            $or: [
              { name: name.trim() },
              {
                code: code
                  .trim()
                  .toUpperCase(),
              },
            ],
          },
        ],
      });

    if (existingDepartment) {
      return res.status(409).json({
        message:
          "Another department with this name or code already exists.",
      });
    }

    department.name = name.trim();

    department.code =
      code.trim().toUpperCase();

    department.description =
      description.trim();

    department.type = type;

    department.availability =
      availability;

    department.status = status;

    await department.save();

    res.json({
      message:
        "Department updated successfully.",
      department,
    });
  } catch (error) {
    console.error(
      "Update department error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update department.",
    });
  }
};


module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
};