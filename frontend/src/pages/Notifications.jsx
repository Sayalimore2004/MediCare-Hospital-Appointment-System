import { useEffect, useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientData = JSON.parse(
    localStorage.getItem("patientData") || "{}"
  );

  const patientId = patientData.patientId || "PAT1002";

  // Fetch patient notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/notifications/patient/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [patientId]);

  // Mark one notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);
      alert("Unable to mark notification as read.");
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/patient/${patientId}/read-all`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
      alert("Unable to mark all notifications as read.");
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.notificationId !== notificationId
        )
      );
    } catch (error) {
      console.error("Delete notification error:", error);
      alert("Unable to delete notification.");
    }
  };

  // Notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Appointment":
        return "📅";

      case "Prescription":
        return "💊";

      case "Medical Record":
        return "📋";

      case "Billing":
        return "💳";

      case "System":
        return "🔔";

      default:
        return "🔔";
    }
  };

  // Format notification date
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const recentUpdates = notifications.filter((notification) => {
    if (!notification.createdAt) {
      return false;
    }

    const createdDate = new Date(notification.createdAt);
    const today = new Date();

    const difference =
      today.getTime() - createdDate.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    return difference <= oneDay;
  }).length;

  return (
    <div className="notifications-page">

      {/* Page Header */}

      <section className="notifications-header">

        <div>
          <span className="notifications-label">
            PATIENT NOTIFICATIONS
          </span>

          <h1>Notifications</h1>

          <p>
            Stay updated with your appointments, prescriptions, payments and
            healthcare information.
          </p>
        </div>

      </section>


      {/* Main Content */}

      <section className="notifications-content">

        {/* Notification Summary */}

        <div className="notification-summary">

          <div className="notification-summary-card">

            <div className="notification-summary-icon">
              🔔
            </div>

            <div>
              <span>Total Notifications</span>
              <strong>{totalNotifications}</strong>
            </div>

          </div>


          <div className="notification-summary-card">

            <div className="notification-summary-icon">
              ●
            </div>

            <div>
              <span>Unread Notifications</span>
              <strong>{unreadNotifications}</strong>
            </div>

          </div>


          <div className="notification-summary-card">

            <div className="notification-summary-icon">
              ✓
            </div>

            <div>
              <span>Recent Updates</span>
              <strong>{recentUpdates}</strong>
            </div>

          </div>

        </div>


        {/* Notifications List */}

        <section className="notifications-section">

          <div className="notifications-section-heading">

            <div>
              <span>RECENT UPDATES</span>
              <h2>Healthcare Notifications</h2>
            </div>

            <button
              className="mark-read-btn"
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0 || unreadNotifications === 0}
            >
              Mark all as read
            </button>

          </div>


          {/* Loading */}

          {loading && (
            <div className="notifications-empty">
              Loading notifications...
            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="notifications-empty">
              {error}
            </div>
          )}


          {/* Empty */}

          {!loading && !error && notifications.length === 0 && (
            <div className="notifications-empty">
              No notifications available.
            </div>
          )}


          {/* Notification List */}

          {!loading && !error && notifications.length > 0 && (
            <div className="notifications-list">

              {notifications.map((notification) => (

                <div
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  key={notification.notificationId}
                >

                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>


                  <div className="notification-details">

                    <strong>{notification.title}</strong>

                    <p>
                      {notification.message}
                    </p>

                    <span>
                      {formatDate(notification.notificationDate)}
                    </span>

                  </div>


                  {!notification.isRead && (
                    <span className="unread-dot"></span>
                  )}


                  <div className="notification-actions">

                    {!notification.isRead && (
                      <button
                        className="notification-action-btn"
                        onClick={() =>
                          handleMarkAsRead(
                            notification.notificationId
                          )
                        }
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      className="notification-delete-btn"
                      onClick={() =>
                        handleDelete(
                          notification.notificationId
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </section>

    </div>
  );
}

export default Notifications;
