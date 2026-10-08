import { useEffect, useMemo, useState } from "react";
import "./DoctorNotifications.css";

function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const doctorData = JSON.parse(
    localStorage.getItem("doctorData") || "{}"
  );

  const doctorId = doctorData?.doctorId;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (!doctorId) {
          setNotifications([]);
          return;
        }

        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/notifications/doctor/${doctorId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch notifications."
          );
        }

        const formattedNotifications = (
          Array.isArray(data) ? data : []
        ).map((notification) => ({
          id: notification.notificationId,
          type: getNotificationType(notification.type),
          originalType: notification.type,
          icon: getNotificationIcon(notification.type),
          title: notification.title,
          message: notification.message,
          time: formatNotificationTime(
            notification.notificationDate
          ),
          read: notification.isRead,
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error(
          "Failed to load doctor notifications:",
          error
        );

        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [doctorId]);

  const getNotificationType = (type) => {
    if (type === "Appointment") {
      return "appointments";
    }

    if (
      type === "Prescription" ||
      type === "Medical Record"
    ) {
      return "clinical";
    }

    return "system";
  };

  const getNotificationIcon = (type) => {
    if (type === "Appointment") {
      return "📅";
    }

    if (type === "Prescription") {
      return "💊";
    }

    if (type === "Medical Record") {
      return "📋";
    }

    return "⚙️";
  };

  const formatNotificationTime = (dateString) => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const appointmentCount = notifications.filter(
    (notification) =>
      notification.type === "appointments"
  ).length;

  const clinicalCount = notifications.filter(
    (notification) =>
      notification.type === "clinical"
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        notification.message
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        notification.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [
    notifications,
    searchTerm,
    activeFilter,
  ]);

  const markRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark notification as read."
        );
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

      if (
        selectedNotification?.id === notificationId
      ) {
        setSelectedNotification({
          ...selectedNotification,
          read: true,
        });
      }
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const markAllRead = async () => {
    try {
      if (!doctorId) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/doctor/${doctorId}/read-all`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark all notifications as read."
        );
      }

      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
      );

      if (selectedNotification) {
        setSelectedNotification({
          ...selectedNotification,
          read: true,
        });
      }
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const deleteNotification = async (
    notificationId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete notification."
        );
      }

      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );

      if (
        selectedNotification?.id === notificationId
      ) {
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  const openNotification = async (
    notification
  ) => {
    setSelectedNotification(notification);

    if (!notification.read) {
      await markRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="doctor-notifications-page">
        <div className="doctor-notifications-loading">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-notifications-page">
      {/* Header */}

      <div className="doctor-notifications-header">
        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with appointments,
            clinical updates and system alerts.
          </p>
        </div>

        <div className="doctor-notification-header-actions">
          {unreadCount > 0 && (
            <span className="doctor-unread-badge">
              {unreadCount} Unread
            </span>
          )}

          {unreadCount > 0 && (
            <button
              className="doctor-mark-all-button"
              onClick={markAllRead}
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Summary */}

      <div className="doctor-notification-summary">
        <div className="doctor-notification-summary-card">
          <div className="doctor-summary-icon">
            🔔
          </div>

          <div>
            <span>Total Notifications</span>
            <strong>{notifications.length}</strong>
          </div>
        </div>

        <div className="doctor-notification-summary-card">
          <div className="doctor-summary-icon">
            📅
          </div>

          <div>
            <span>Appointments</span>
            <strong>{appointmentCount}</strong>
          </div>
        </div>

        <div className="doctor-notification-summary-card">
          <div className="doctor-summary-icon">
            🩺
          </div>

          <div>
            <span>Clinical</span>
            <strong>{clinicalCount}</strong>
          </div>
        </div>

        <div className="doctor-notification-summary-card">
          <div className="doctor-summary-icon">
            📬
          </div>

          <div>
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>
      </div>

      {/* Search + Filters */}

      <div className="doctor-notification-toolbar">
        <div className="doctor-notification-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="doctor-notification-filters">
          <button
            className={
              activeFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All
          </button>

          <button
            className={
              activeFilter === "appointments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("appointments")
            }
          >
            Appointments
          </button>

          <button
            className={
              activeFilter === "clinical"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("clinical")
            }
          >
            Clinical
          </button>

          <button
            className={
              activeFilter === "system"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("system")
            }
          >
            System
          </button>
        </div>
      </div>

      {/* Notifications */}

      <div className="doctor-notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="doctor-no-notifications">
            <div className="doctor-no-notifications-icon">
              🔔
            </div>

            <h3>No notifications found</h3>

            <p>
              There are no notifications matching
              your current search or filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map(
            (notification) => (
              <div
                key={notification.id}
                className={`doctor-notification-card ${
                  notification.read
                    ? "read"
                    : "unread"
                }`}
                onClick={() =>
                  openNotification(notification)
                }
              >
                <div className="doctor-notification-icon">
                  {notification.icon}
                </div>

                <div className="doctor-notification-content">
                  <div className="doctor-notification-title-row">
                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="doctor-notification-new">
                        New
                      </span>
                    )}
                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="doctor-notification-time">
                    {notification.time}
                  </span>
                </div>

                <div className="doctor-notification-actions">
                  {!notification.read && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        markRead(
                          notification.id
                        );
                      }}
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteNotification(
                        notification.id
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* View Modal */}

      {selectedNotification && (
        <div
          className="doctor-notification-modal-overlay"
          onClick={() =>
            setSelectedNotification(null)
          }
        >
          <div
            className="doctor-notification-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="doctor-notification-modal-header">
              <h2>
                {selectedNotification.title}
              </h2>

              <button
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                ×
              </button>
            </div>

            <div className="doctor-notification-modal-body">
              <div className="doctor-notification-modal-icon">
                {selectedNotification.icon}
              </div>

              <p>
                {selectedNotification.message}
              </p>

              <span>
                {selectedNotification.time}
              </span>
            </div>

            <div className="doctor-notification-modal-footer">
              <button
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorNotifications;