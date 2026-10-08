const Notification = require("../models/Notification");

// Create a notification
const createNotification = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      type,
      title,
      message,
      relatedId = "",
      notificationDate,
    } = req.body;

    // At least one user must be provided
    if (
      (!patientId || !patientName) &&
      (!doctorId || !doctorName)
    ) {
      return res.status(400).json({
        message:
          "Either patientId and patientName or doctorId and doctorName are required",
      });
    }

    if (
      !type ||
      !title ||
      !message ||
      !notificationDate
    ) {
      return res.status(400).json({
        message:
          "type, title, message and notificationDate are required",
      });
    }

    // Generate Notification ID
    const notificationCount =
      await Notification.countDocuments();

    const notificationId =
      `N${1001 + notificationCount}`;

    const notification = await Notification.create({
      notificationId,

      patientId: patientId || "",
      patientName: patientName || "",

      doctorId: doctorId || "",
      doctorName: doctorName || "",

      type,
      title,
      message,
      relatedId,

      isRead: false,

      notificationDate,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};


// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find().sort({
        createdAt: -1,
      });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get all notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};


// Get notifications for a patient
const getPatientNotifications = async (
  req,
  res
) => {
  try {
    const { patientId } = req.params;

    const notifications =
      await Notification.find({
        patientId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get patient notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch patient notifications",
      error: error.message,
    });
  }
};


// Get notifications for a doctor
const getDoctorNotifications = async (
  req,
  res
) => {
  try {
    const { doctorId } = req.params;

    const notifications =
      await Notification.find({
        doctorId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get doctor notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch doctor notifications",
      error: error.message,
    });
  }
};


// Get unread doctor notification count
const getDoctorUnreadNotificationCount =
  async (req, res) => {
    try {
      const { doctorId } = req.params;

      const unreadCount =
        await Notification.countDocuments({
          doctorId,
          isRead: false,
        });

      res.status(200).json({
        unreadCount,
      });
    } catch (error) {
      console.error(
        "Get doctor unread notification count error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch unread notification count",
        error: error.message,
      });
    }
  };


// Mark one notification as read
const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findOne({
        notificationId,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update notification",
      error: error.message,
    });
  }
};


// Mark all patient notifications as read
const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    const { patientId } = req.params;

    await Notification.updateMany(
      {
        patientId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update notifications",
      error: error.message,
    });
  }
};


// Mark all doctor notifications as read
const markAllDoctorNotificationsAsRead =
  async (req, res) => {
    try {
      const { doctorId } = req.params;

      await Notification.updateMany(
        {
          doctorId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      res.status(200).json({
        message:
          "All doctor notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all doctor notifications as read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update doctor notifications",
        error: error.message,
      });
    }
  };


// Delete one notification
const deleteNotification = async (
  req,
  res
) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findOneAndDelete({
        notificationId,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message:
        "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete notification",
      error: error.message,
    });
  }
};


module.exports = {
  createNotification,
  getAllNotifications,
  getPatientNotifications,
  getDoctorNotifications,
  getDoctorUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markAllDoctorNotificationsAsRead,
  deleteNotification,
};