const express = require("express");

const {
  createNotification,
  getAllNotifications,
  getPatientNotifications,
  getDoctorNotifications,
  getDoctorUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markAllDoctorNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();


// Create notification
router.post(
  "/",
  createNotification
);


// Get all notifications
router.get(
  "/",
  getAllNotifications
);


// Patient notifications
router.get(
  "/patient/:patientId",
  getPatientNotifications
);


// Doctor notifications
router.get(
  "/doctor/:doctorId",
  getDoctorNotifications
);


// Doctor unread notification count
router.get(
  "/doctor/:doctorId/unread-count",
  getDoctorUnreadNotificationCount
);


// Mark all patient notifications as read
router.patch(
  "/patient/:patientId/read-all",
  markAllNotificationsAsRead
);


// Mark all doctor notifications as read
router.patch(
  "/doctor/:doctorId/read-all",
  markAllDoctorNotificationsAsRead
);


// Mark one notification as read
router.patch(
  "/:notificationId/read",
  markNotificationAsRead
);


// Delete one notification
router.delete(
  "/:notificationId",
  deleteNotification
);


module.exports = router;