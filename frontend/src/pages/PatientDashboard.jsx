import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [appointments, setAppointments] =
    useState([]);

  const [medicalRecords, setMedicalRecords] =
    useState([]);

  const [prescriptions, setPrescriptions] =
    useState([]);

  const [bills, setBills] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    loadPatientDashboard();
  }, []);


  const getPatientData = () => {
    const storedPatient =
      localStorage.getItem("patientData");

    if (!storedPatient) {
      return null;
    }

    try {
      return JSON.parse(storedPatient);
    } catch (error) {
      console.error(
        "Patient data parse error:",
        error
      );

      return null;
    }
  };


  const loadPatientDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "patientToken"
          );

        const storedPatient =
          getPatientData();

        if (
          !token ||
          !storedPatient
        ) {
          navigate("/login");
          return;
        }

        if (!storedPatient.patientId) {
          setError(
            "Patient information not found."
          );
          return;
        }

        setPatient(storedPatient);


        const patientId =
          storedPatient.patientId;


        const headers = {
          Authorization: `Bearer ${token}`,
        };


        const [
          appointmentsResponse,
          recordsResponse,
          prescriptionsResponse,
          billsResponse,
          notificationsResponse,
        ] = await Promise.all([
          fetch(
            `http://localhost:5000/api/appointments/patient/${patientId}`,
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:5000/api/medical-records/patient/${patientId}`,
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:5000/api/prescriptions/patient/${patientId}`,
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:5000/api/bills/patient/${patientId}`,
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:5000/api/notifications/patient/${patientId}`,
            {
              headers,
            }
          ),
        ]);


        const [
          appointmentsData,
          recordsData,
          prescriptionsData,
          billsData,
          notificationsData,
        ] = await Promise.all([
          appointmentsResponse.json(),
          recordsResponse.json(),
          prescriptionsResponse.json(),
          billsResponse.json(),
          notificationsResponse.json(),
        ]);


        if (!appointmentsResponse.ok) {
          console.error(
            "Appointments:",
            appointmentsData
          );
        }

        if (!recordsResponse.ok) {
          console.error(
            "Medical records:",
            recordsData
          );
        }

        if (!prescriptionsResponse.ok) {
          console.error(
            "Prescriptions:",
            prescriptionsData
          );
        }

        if (!billsResponse.ok) {
          console.error(
            "Bills:",
            billsData
          );
        }

        if (!notificationsResponse.ok) {
          console.error(
            "Notifications:",
            notificationsData
          );
        }


        const appointmentList =
          Array.isArray(
            appointmentsData
          )
            ? appointmentsData
            : appointmentsData.appointments ||
              [];


        const recordList =
          Array.isArray(
            recordsData
          )
            ? recordsData
            : recordsData.records ||
              recordsData.medicalRecords ||
              [];


        const prescriptionList =
          Array.isArray(
            prescriptionsData
          )
            ? prescriptionsData
            : prescriptionsData.prescriptions ||
              [];


        const billList =
          Array.isArray(
            billsData
          )
            ? billsData
            : billsData.bills ||
              [];


        const notificationList =
          Array.isArray(
            notificationsData
          )
            ? notificationsData
            : notificationsData.notifications ||
              [];


        setAppointments(
          appointmentList
        );

        setMedicalRecords(
          recordList
        );

        setPrescriptions(
          prescriptionList
        );

        setBills(
          billList
        );

        setNotifications(
          notificationList
        );

      } catch (error) {
        console.error(
          "Patient dashboard error:",
          error
        );

        setError(
          "Unable to load dashboard data. Please make sure the MediCare backend is running."
        );
      } finally {
        setLoading(false);
      }
    };


  const handleLogout =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "patientToken"
          );

        const storedPatient =
          getPatientData();

        if (
          storedPatient?.patientId
        ) {
          await fetch(
            "http://localhost:5000/api/patients/logout",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                patientId:
                  storedPatient.patientId,
              }),
            }
          );
        }

      } catch (error) {
        console.error(
          "Patient logout error:",
          error
        );
      }

      localStorage.removeItem(
        "patientToken"
      );

      localStorage.removeItem(
        "patientData"
      );

      localStorage.removeItem(
        "rememberPatient"
      );

      navigate("/login");
    };


  const getUpcomingAppointments =
    () => {
      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );


      return appointments
        .filter(
          (appointment) => {
            if (
              appointment.status ===
                "Cancelled" ||
              appointment.status ===
                "Rejected" ||
              appointment.status ===
                "Completed"
            ) {
              return false;
            }

            if (
              !appointment.appointmentDate
            ) {
              return false;
            }

            const appointmentDate =
              new Date(
                `${appointment.appointmentDate}T00:00:00`
              );

            return (
              appointmentDate >=
              today
            );
          }
        )
        .sort((a, b) => {
          const dateA =
            `${a.appointmentDate || ""} ${
              a.appointmentTime || ""
            }`;

          const dateB =
            `${b.appointmentDate || ""} ${
              b.appointmentTime || ""
            }`;

          return dateA.localeCompare(
            dateB
          );
        });
    };


  const upcomingAppointments =
    getUpcomingAppointments();


  const nextAppointment =
    upcomingAppointments.length > 0
      ? upcomingAppointments[0]
      : null;


  const pendingBills =
    bills.filter(
      (bill) => {
        const status =
          String(
            bill.status ||
              bill.paymentStatus ||
              ""
          ).toLowerCase();

        return (
          status === "pending" ||
          status === "unpaid" ||
          status === "due"
        );
      }
    );


  const unreadNotifications =
    notifications.filter(
      (notification) =>
        notification.isRead === false
    ).length;


  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatRelativeDate =
    (date) => {
      if (!date) {
        return "";
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "";
      }

      const now =
        new Date();

      const difference =
        now.getTime() -
        parsedDate.getTime();

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

      if (days <= 0) {
        return "Today";
      }

      if (days === 1) {
        return "Yesterday";
      }

      if (days < 7) {
        return `${days} days ago`;
      }

      return parsedDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      );
    };


  const getNotificationIcon =
    (type) => {
      if (
        type === "Appointment"
      ) {
        return "📅";
      }

      if (
        type === "Prescription"
      ) {
        return "💊";
      }

      if (
        type === "Medical Record"
      ) {
        return "📋";
      }

      if (
        type === "Billing"
      ) {
        return "💳";
      }

      return "🔔";
    };


  const patientName =
    patient?.name ||
    "Patient";


  const firstName =
    patientName
      .trim()
      .split(" ")[0] ||
    "Patient";


  const avatarLetter =
    firstName
      .charAt(0)
      .toUpperCase();


  return (
    <div className="patient-dashboard">

      {/* Sidebar */}

      <aside className="patient-sidebar">

        <div className="sidebar-logo">
          <span>✚</span>
          <strong>MediCare</strong>
        </div>


        <div className="patient-profile">

          <div className="patient-avatar">
            {avatarLetter}
          </div>

          <div>
            <strong>
              {patientName}
            </strong>

            <span>
              Patient
            </span>
          </div>

        </div>


        <nav className="dashboard-nav">

          <Link
            to="/patient-dashboard"
            className="dashboard-nav-item active"
          >
            <span>▦</span>
            Dashboard
          </Link>


          <Link
            to="/patient-dashboard/appointments"
            className="dashboard-nav-item"
          >
            <span>📅</span>
            Appointments
          </Link>


          <Link
            to="/doctors"
            className="dashboard-nav-item"
          >
            <span>👨‍⚕️</span>
            Find a Doctor
          </Link>


          <Link
            to="/patient-dashboard/medical-records"
            className="dashboard-nav-item"
          >
            <span>📋</span>
            Medical Records
          </Link>


          <Link
            to="/patient-dashboard/prescriptions"
            className="dashboard-nav-item"
          >
            <span>💊</span>
            Prescriptions
          </Link>


          <Link
            to="/patient-dashboard/bills"
            className="dashboard-nav-item"
          >
            <span>💳</span>
            Bills & Payments
          </Link>


          <Link
            to="/patient-dashboard/notifications"
            className="dashboard-nav-item"
          >
            <span>🔔</span>
            Notifications
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <Link
            to="/"
            className="dashboard-nav-item"
          >
            <span>↩</span>
            Back to Website
          </Link>


          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
          >
            <span>⇥</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Main Dashboard */}

      <main className="patient-dashboard-main">

        <header className="dashboard-topbar">

          <div>

            <span className="dashboard-label">
              PATIENT DASHBOARD
            </span>


            <h1>
              Good morning, {firstName}
            </h1>


            <p>
              Manage your appointments,
              medical records and
              healthcare information
              from one place.
            </p>

          </div>


          <div className="topbar-profile">

            <Link
              to="/patient-dashboard/notifications"
              className="notification-btn"
            >
              🔔

              {unreadNotifications >
                0 && (
                <span>
                  {unreadNotifications}
                </span>
              )}

            </Link>


            <div className="topbar-avatar">
              {avatarLetter}
            </div>

          </div>

        </header>


        <section className="dashboard-content">


          {error && (
            <div
              style={{
                padding:
                  "12px 16px",
                marginBottom:
                  "20px",
                borderRadius:
                  "8px",
                background:
                  "#fff1f1",
                color:
                  "#b42318",
              }}
            >
              {error}
            </div>
          )}


          {/* Statistics */}

          <div className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-icon">
                📅
              </div>

              <div>

                <span>
                  Upcoming Appointments
                </span>

                <strong>
                  {loading
                    ? "..."
                    : upcomingAppointments.length}
                </strong>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon">
                📋
              </div>

              <div>

                <span>
                  Medical Records
                </span>

                <strong>
                  {loading
                    ? "..."
                    : medicalRecords.length}
                </strong>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon">
                💊
              </div>

              <div>

                <span>
                  Prescriptions
                </span>

                <strong>
                  {loading
                    ? "..."
                    : prescriptions.length}
                </strong>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon">
                💳
              </div>

              <div>

                <span>
                  Pending Bills
                </span>

                <strong>
                  {loading
                    ? "..."
                    : pendingBills.length}
                </strong>

              </div>

            </div>

          </div>


          {/* Dashboard Grid */}

          <div className="dashboard-main-grid">


            {/* Upcoming Appointment */}

            <section className="dashboard-card appointment-card">

              <div className="dashboard-card-heading">

                <div>

                  <span>
                    UPCOMING APPOINTMENT
                  </span>

                  <h2>
                    Next Appointment
                  </h2>

                </div>


                {nextAppointment && (
                  <span className="appointment-status">
                    {nextAppointment.status}
                  </span>
                )}

              </div>


              {loading ? (

                <div className="appointment-doctor">

                  <div>
                    Loading appointment...
                  </div>

                </div>

              ) : nextAppointment ? (

                <>

                  <div className="appointment-doctor">

                    <div className="dashboard-doctor-avatar">
                      👨‍⚕️
                    </div>

                    <div>

                      <h3>
                        {
                          nextAppointment.doctorName ||
                          "Doctor"
                        }
                      </h3>

                      <p>
                        {
                          nextAppointment.department ||
                          "General Consultation"
                        }
                      </p>

                    </div>

                  </div>


                  <div className="appointment-details">

                    <div>

                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          nextAppointment.appointmentDate
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Time
                      </span>

                      <strong>
                        {
                          nextAppointment.appointmentTime ||
                          "—"
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Consultation
                      </span>

                      <strong>
                        {
                          nextAppointment.consultationFee
                            ? `₹${nextAppointment.consultationFee}`
                            : nextAppointment.fee
                            ? `₹${nextAppointment.fee}`
                            : "—"
                        }
                      </strong>

                    </div>

                  </div>

                </>

              ) : (

                <div
                  style={{
                    padding:
                      "20px 0",
                  }}
                >
                  <p>
                    No upcoming appointments.
                  </p>
                </div>

              )}


              <Link
                to="/patient-dashboard/appointments"
                className="dashboard-primary-btn"
              >
                View Appointment
              </Link>

            </section>


            {/* Quick Actions */}

            <section className="dashboard-card quick-actions-card">

              <div className="dashboard-card-heading">

                <div>

                  <span>
                    QUICK ACCESS
                  </span>

                  <h2>
                    Healthcare Services
                  </h2>

                </div>

              </div>


              <div className="quick-actions">

                <Link to="/doctors">

                  <span>👨‍⚕️</span>

                  <div>

                    <strong>
                      Find a Doctor
                    </strong>

                    <small>
                      Browse specialists
                    </small>

                  </div>

                </Link>


                <Link to="/doctors">

                  <span>📅</span>

                  <div>

                    <strong>
                      Book Appointment
                    </strong>

                    <small>
                      Schedule a consultation
                    </small>

                  </div>

                </Link>


                <Link
                  to="/patient-dashboard/medical-records"
                >

                  <span>📋</span>

                  <div>

                    <strong>
                      Medical Records
                    </strong>

                    <small>
                      View your records
                    </small>

                  </div>

                </Link>


                <Link
                  to="/patient-dashboard/prescriptions"
                >

                  <span>💊</span>

                  <div>

                    <strong>
                      Prescriptions
                    </strong>

                    <small>
                      View medications
                    </small>

                  </div>

                </Link>

              </div>

            </section>

          </div>


          {/* Recent Activity */}

          <section className="dashboard-card recent-activity">

            <div className="dashboard-card-heading">

              <div>

                <span>
                  RECENT ACTIVITY
                </span>

                <h2>
                  Healthcare Updates
                </h2>

              </div>


              <Link
                to="/patient-dashboard/notifications"
              >
                View All
              </Link>

            </div>


            <div className="activity-list">

              {loading ? (

                <div className="activity-item">

                  <div>
                    Loading recent activity...
                  </div>

                </div>

              ) : notifications.length >
                0 ? (

                notifications
                  .slice(0, 3)
                  .map(
                    (notification) => (
                      <div
                        className="activity-item"
                        key={
                          notification._id ||
                          notification.notificationId ||
                          Math.random()
                        }
                      >

                        <div className="activity-icon">
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>


                        <div>

                          <strong>
                            {
                              notification.title ||
                              "Healthcare Update"
                            }
                          </strong>

                          <p>
                            {
                              notification.message ||
                              "You have a new healthcare update."
                            }
                          </p>

                        </div>


                        <span>
                          {formatRelativeDate(
                            notification.notificationDate ||
                            notification.createdAt
                          )}
                        </span>

                      </div>
                    )
                  )

              ) : (

                <div className="activity-item">

                  <div className="activity-icon">
                    🔔
                  </div>

                  <div>

                    <strong>
                      No recent activity
                    </strong>

                    <p>
                      Your healthcare updates
                      will appear here.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default PatientDashboard;