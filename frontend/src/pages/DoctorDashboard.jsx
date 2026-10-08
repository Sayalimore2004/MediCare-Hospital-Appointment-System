import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);

  useEffect(() => {
    const loadDoctorData = () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const savedDoctor = localStorage.getItem("doctorData");

        if (!token || !savedDoctor) {
          navigate("/login");
          return;
        }

        const doctorData = JSON.parse(savedDoctor);

        if (!doctorData?.doctorId) {
          localStorage.removeItem("doctorToken");
          localStorage.removeItem("doctorData");
          localStorage.removeItem("rememberDoctor");

          navigate("/login");
          return;
        }

        setDoctor(doctorData);
      } catch (error) {
        console.error(
          "Failed to load doctor information:",
          error
        );

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctorData");
        localStorage.removeItem("rememberDoctor");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDoctorData();
  }, [navigate]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const savedDoctor = localStorage.getItem("doctorData");

        if (!savedDoctor) {
          return;
        }

        const doctorData = JSON.parse(savedDoctor);

        if (!doctorData?.doctorId) {
          return;
        }

        setAppointmentsLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/appointments/doctor/${doctorData.doctorId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch appointments."
          );
        }

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load doctor appointments:",
          error
        );

        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  useEffect(() => {
    const loadMedicalRecords = async () => {
      try {
        const savedDoctor = localStorage.getItem("doctorData");

        if (!savedDoctor) {
          return;
        }

        const doctorData = JSON.parse(savedDoctor);

        if (!doctorData?.doctorId) {
          return;
        }

        setRecordsLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/medical-records/doctor/${doctorData.doctorId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch medical records."
          );
        }

        setMedicalRecords(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load medical records:",
          error
        );

        setMedicalRecords([]);
      } finally {
        setRecordsLoading(false);
      }
    };

    loadMedicalRecords();
  }, []);

  if (loading) {
    return (
      <div className="doctor-dashboard-content">
        <div className="doctor-dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  const doctorName = doctor.name || "Doctor";

  const doctorInitials = doctorName
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) =>
      name.charAt(0).toUpperCase()
    )
    .join("");

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const todaysAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentDate === todayDate &&
      appointment.status !== "Cancelled" &&
      appointment.status !== "Rejected"
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentDate >= todayDate &&
      appointment.status !== "Cancelled" &&
      appointment.status !== "Rejected"
  );

  const uniquePatientIds = new Set(
    appointments.map(
      (appointment) => appointment.patientId
    )
  );

  const totalPatients = uniquePatientIds.size;

  // Real pending medical records from MongoDB
  const pendingRecords = medicalRecords.filter(
    (record) =>
      record.status === "Pending"
  ).length;

  const sortedTodayAppointments = [
    ...todaysAppointments
  ].sort((a, b) =>
    a.appointmentTime.localeCompare(
      b.appointmentTime
    )
  );

  const recentConsultations = appointments
    .filter(
      (appointment) =>
        appointment.status === "Completed"
    )
    .sort((a, b) => {
      const dateA = `${a.appointmentDate} ${a.appointmentTime}`;
      const dateB = `${b.appointmentDate} ${b.appointmentTime}`;

      return dateB.localeCompare(dateA);
    })
    .filter(
      (appointment, index, array) =>
        array.findIndex(
          (item) =>
            item.patientId === appointment.patientId
        ) === index
    )
    .slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getReason = (appointment) => {
    return (
      appointment.reason ||
      "General Consultation"
    );
  };

  const getPatientInitials = (name) => {
    if (!name) {
      return "PT";
    }

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "doctor-status-completed";
    }

    if (
      status === "Pending" ||
      status === "Follow-up"
    ) {
      return "doctor-status-pending";
    }

    if (status === "Cancelled") {
      return "doctor-status-cancelled";
    }

    return "doctor-status-confirmed";
  };

  return (
    <div className="doctor-dashboard-content">

      {/* Header */}

      <header className="doctor-dashboard-header">

        <div>
          <span className="doctor-dashboard-label">
            DOCTOR DASHBOARD
          </span>

          <h1>
            Welcome, {doctorName}
          </h1>

          <p>
            Here's an overview of your clinical activities.
          </p>
        </div>

        <div className="doctor-header-profile">

          <button
            className="doctor-notification-btn"
            onClick={() =>
              navigate(
                "/doctor-dashboard/notifications"
              )
            }
            title="Notifications"
          >
            🔔
            <span></span>
          </button>

          <button
            className="doctor-top-avatar"
            onClick={() =>
              navigate(
                "/doctor-dashboard/profile"
              )
            }
            title="My Profile"
          >
            {doctorInitials}
          </button>

        </div>

      </header>

      {/* Statistics */}

      <section className="doctor-dashboard-stats">

        <button
          className="doctor-stat-card"
          onClick={() =>
            navigate(
              "/doctor-dashboard/appointments"
            )
          }
        >
          <div className="doctor-stat-icon">
            📅
          </div>

          <div>
            <span>
              Today's Appointments
            </span>

            <strong>
              {appointmentsLoading
                ? "..."
                : todaysAppointments.length}
            </strong>
          </div>

        </button>

        <button
          className="doctor-stat-card"
          onClick={() =>
            navigate(
              "/doctor-dashboard/patients"
            )
          }
        >
          <div className="doctor-stat-icon">
            👥
          </div>

          <div>
            <span>
              Total Patients
            </span>

            <strong>
              {appointmentsLoading
                ? "..."
                : totalPatients}
            </strong>
          </div>

        </button>

        <button
          className="doctor-stat-card"
          onClick={() =>
            navigate(
              "/doctor-dashboard/appointments"
            )
          }
        >
          <div className="doctor-stat-icon">
            🕐
          </div>

          <div>
            <span>
              Upcoming Appointments
            </span>

            <strong>
              {appointmentsLoading
                ? "..."
                : upcomingAppointments.length}
            </strong>
          </div>

        </button>

        <button
          className="doctor-stat-card"
          onClick={() =>
            navigate(
              "/doctor-dashboard/medical-records"
            )
          }
        >
          <div className="doctor-stat-icon">
            📋
          </div>

          <div>
            <span>
              Pending Records
            </span>

            <strong>
              {recordsLoading
                ? "..."
                : pendingRecords}
            </strong>
          </div>

        </button>

      </section>

      {/* Main Dashboard Grid */}

      <section className="doctor-dashboard-grid">

        {/* Today's Appointments */}

        <section className="doctor-dashboard-card doctor-appointments-card">

          <div className="doctor-card-heading">

            <div>
              <span>
                TODAY'S SCHEDULE
              </span>

              <h2>
                Today's Appointments
              </h2>
            </div>

            <span className="doctor-date">
              {formatDate(todayDate)}
            </span>

          </div>

          <div className="doctor-appointment-list">

            {appointmentsLoading ? (
              <div className="doctor-empty-state">
                Loading appointments...
              </div>
            ) : sortedTodayAppointments.length === 0 ? (
              <div className="doctor-empty-state">
                No appointments scheduled for today.
              </div>
            ) : (
              sortedTodayAppointments
                .slice(0, 5)
                .map((appointment) => (
                  <div
                    className="doctor-appointment-item"
                    key={appointment.appointmentId}
                  >

                    <div className="doctor-patient-avatar">
                      {getPatientInitials(
                        appointment.patientName
                      )}
                    </div>

                    <div className="doctor-patient-info">

                      <strong>
                        {appointment.patientName}
                      </strong>

                      <span>
                        {getReason(appointment)}
                      </span>

                    </div>

                    <div className="doctor-appointment-time">

                      <strong>
                        {appointment.appointmentTime}
                      </strong>

                      <span
                        className={getStatusClass(
                          appointment.status
                        )}
                      >
                        {appointment.status}
                      </span>

                    </div>

                  </div>
                ))
            )}

          </div>

          <button
            className="doctor-view-all-btn"
            onClick={() =>
              navigate(
                "/doctor-dashboard/appointments"
              )
            }
          >
            View All Appointments →
          </button>

        </section>

        {/* Quick Access */}

        <section className="doctor-dashboard-card doctor-quick-card">

          <div className="doctor-card-heading">

            <div>
              <span>
                QUICK ACCESS
              </span>

              <h2>
                Clinical Services
              </h2>
            </div>

          </div>

          <div className="doctor-quick-actions">

            <button
              onClick={() =>
                navigate(
                  "/doctor-dashboard/schedule"
                )
              }
            >
              <span>📅</span>

              <div>
                <strong>
                  Manage Schedule
                </strong>

                <small>
                  Set your availability
                </small>
              </div>

            </button>

            <button
              onClick={() =>
                navigate(
                  "/doctor-dashboard/patients"
                )
              }
            >
              <span>👥</span>

              <div>
                <strong>
                  View Patients
                </strong>

                <small>
                  Access patient information
                </small>
              </div>

            </button>

            <button
              onClick={() =>
                navigate(
                  "/doctor-dashboard/medical-records"
                )
              }
            >
              <span>📋</span>

              <div>
                <strong>
                  Medical Records
                </strong>

                <small>
                  Review patient records
                </small>
              </div>

            </button>

            <button
              onClick={() =>
                navigate(
                  "/doctor-dashboard/prescriptions"
                )
              }
            >
              <span>💊</span>

              <div>
                <strong>
                  Prescriptions
                </strong>

                <small>
                  Create prescriptions
                </small>
              </div>

            </button>

          </div>

        </section>

      </section>

      {/* Recent Consultations */}

      <section className="doctor-dashboard-card doctor-recent-patients">

        <div className="doctor-card-heading">

          <div>
            <span>
              RECENT CONSULTATIONS
            </span>

            <h2>
              Recently Consulted Patients
            </h2>
          </div>

          <button
            onClick={() =>
              navigate(
                "/doctor-dashboard/patients"
              )
            }
          >
            View All
          </button>

        </div>

        <div className="doctor-patient-table">

          <div className="doctor-table-header">
            <span>Patient</span>
            <span>Last Visit</span>
            <span>Consultation</span>
            <span>Status</span>
          </div>

          {appointmentsLoading ? (
            <div className="doctor-empty-state">
              Loading patients...
            </div>
          ) : recentConsultations.length === 0 ? (
            <div className="doctor-empty-state">
              No completed consultations yet.
            </div>
          ) : (
            recentConsultations.map((appointment) => (
              <div
                className="doctor-table-row"
                key={appointment.appointmentId}
              >

                <div className="doctor-table-patient">

                  <div className="doctor-patient-avatar">
                    {getPatientInitials(
                      appointment.patientName
                    )}
                  </div>

                  <div>

                    <strong>
                      {appointment.patientName}
                    </strong>

                    <span>
                      {appointment.patientId}
                    </span>

                  </div>

                </div>

                <span>
                  {formatDate(
                    appointment.appointmentDate
                  )}
                </span>

                <span>
                  {getReason(appointment)}
                </span>

                <span
                  className={getStatusClass(
                    appointment.status
                  )}
                >
                  {appointment.status}
                </span>

              </div>
            ))
          )}

        </div>

      </section>

    </div>
  );
}

export default DoctorDashboard;