const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");

const getDashboardStats = async (req, res) => {
  try {
    // PATIENT COUNTS
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({
      status: "Active",
    });
    const inactivePatients = await Patient.countDocuments({
      status: "Inactive",
    });

    // DOCTOR COUNTS
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({
      status: "Active",
    });
    const inactiveDoctors = await Doctor.countDocuments({
      status: "Inactive",
    });

    // DEPARTMENT COUNTS
    const totalDepartments = await Department.countDocuments();
    const activeDepartments = await Department.countDocuments({
      status: "Active",
    });

    // APPOINTMENT COUNTS
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending",
    });
    const confirmedAppointments = await Appointment.countDocuments({
      status: "Confirmed",
    });
    const completedAppointments = await Appointment.countDocuments({
      status: "Completed",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      status: "Cancelled",
    });

    // ONLINE USER COUNTS
    const onlinePatients = await Patient.countDocuments({
      isOnline: true,
    });

    const onlineDoctors = await Doctor.countDocuments({
      isOnline: true,
    });

    res.status(200).json({
      patients: {
        total: totalPatients,
        active: activePatients,
        inactive: inactivePatients,
      },

      doctors: {
        total: totalDoctors,
        active: activeDoctors,
        inactive: inactiveDoctors,
      },

      departments: {
        total: totalDepartments,
        active: activeDepartments,
      },

      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },

      onlineUsers: {
        patients: onlinePatients,
        doctors: onlineDoctors,
      },
    });
  } catch (error) {
    console.error(
      "Get admin dashboard statistics error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch admin dashboard statistics.",
    });
  }
};

module.exports = {
  getDashboardStats,
};