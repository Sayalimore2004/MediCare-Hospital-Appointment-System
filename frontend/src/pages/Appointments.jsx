import { useEffect, useState } from "react";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [cancelAppointment, setCancelAppointment] =
    useState(null);

  /* =========================
     FETCH PATIENT APPOINTMENTS
  ========================= */

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const patientData = JSON.parse(
        localStorage.getItem("patientData")
      );

      if (!patientData) {
        setError(
          "Please login as a patient to view your appointments."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/appointments/patient/${patientData.patientId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to fetch appointments."
        );

        return;
      }

      setAppointments(data);

    } catch (error) {
      console.error(
        "Fetch appointments error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the MediCare backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD APPOINTMENTS
  ========================= */

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (dateString) => {
    if (!dateString) {
      return {
        date: "",
        month: "",
        year: ""
      };
    }

    const date = new Date(dateString);

    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];

    return {
      date: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear()
    };
  };

  /* =========================
     CHECK UPCOMING
  ========================= */

  const isUpcoming = (appointment) => {
    const appointmentDate = new Date(
      `${appointment.appointmentDate}T00:00:00`
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return (
      appointmentDate >= today &&
      appointment.status !== "Completed" &&
      appointment.status !== "Cancelled" &&
      appointment.status !== "Rejected"
    );
  };

  /* =========================
     VIEW DETAILS
  ========================= */

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  /* =========================
     CANCEL APPOINTMENT
  ========================= */

  const handleCancel = (appointment) => {
    setCancelAppointment(appointment);
  };

  /* =========================
     CONFIRM CANCELLATION
  ========================= */

  const confirmCancellation = async () => {
    if (!cancelAppointment) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${cancelAppointment.appointmentId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: "Cancelled"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to cancel appointment."
        );

        return;
      }

      setCancelAppointment(null);

      await fetchAppointments();

    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  /* =========================
     CLOSE MODALS
  ========================= */

  const closeDetails = () => {
    setSelectedAppointment(null);
  };

  const closeCancel = () => {
    setCancelAppointment(null);
  };

  /* =========================
     SEPARATE APPOINTMENTS
  ========================= */

  const upcomingAppointments =
    appointments.filter(isUpcoming);

  const previousAppointments =
    appointments.filter(
      (appointment) =>
        !isUpcoming(appointment)
    );

  return (
    <div className="appointments-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="appointments-header">

        <span>
          PATIENT APPOINTMENTS
        </span>

        <h1>
          My Appointments
        </h1>

        <p>
          View and manage your upcoming and previous healthcare appointments.
        </p>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="appointment-error">
          {error}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="appointments-loading">
          Loading your appointments...
        </div>
      ) : (
        <>
          {/* =========================
              UPCOMING APPOINTMENTS
          ========================= */}

          <section className="appointments-section">

            <h2>
              Upcoming Appointments
            </h2>

            {upcomingAppointments.length === 0 ? (
              <div className="no-appointments">
                <h3>
                  No upcoming appointments
                </h3>

                <p>
                  You currently have no upcoming appointments.
                </p>
              </div>
            ) : (
              <div className="appointment-list">

                {upcomingAppointments.map(
                  (appointment) => {

                    const formattedDate =
                      formatDate(
                        appointment.appointmentDate
                      );

                    return (
                      <div
                        className="appointment-card"
                        key={
                          appointment.appointmentId
                        }
                      >

                        {/* DATE */}

                        <div className="appointment-date">

                          <strong>
                            {formattedDate.date}
                          </strong>

                          <span>
                            {formattedDate.month}
                          </span>

                          <small>
                            {formattedDate.year}
                          </small>

                        </div>

                        {/* INFORMATION */}

                        <div className="appointment-info">

                          <h3>
                            {appointment.doctorName}
                          </h3>

                          <p>
                            {appointment.department}
                          </p>

                          <div className="appointment-meta">

                            <span>
                              🕐{" "}
                              {appointment.appointmentTime}
                            </span>

                            <span>
                              🏥{" "}
                              {appointment.department}
                            </span>

                            <span>
                              🆔{" "}
                              {appointment.appointmentId}
                            </span>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="appointment-actions">

                          <span className="appointment-status">
                            {appointment.status}
                          </span>

                          <button
                            type="button"
                            className="view-details-btn"
                            onClick={() =>
                              handleViewDetails(
                                appointment
                              )
                            }
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                              handleCancel(
                                appointment
                              )
                            }
                            disabled={
                              appointment.status ===
                              "Cancelled"
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

          {/* =========================
              PREVIOUS APPOINTMENTS
          ========================= */}

          <section className="appointments-section previous-section">

            <h2>
              Previous Appointments
            </h2>

            {previousAppointments.length === 0 ? (
              <div className="no-appointments">

                <h3>
                  No previous appointments
                </h3>

                <p>
                  Your completed or past appointments will appear here.
                </p>

              </div>
            ) : (
              <div className="previous-appointments">

                {previousAppointments.map(
                  (appointment) => {

                    const formattedDate =
                      formatDate(
                        appointment.appointmentDate
                      );

                    return (
                      <div
                        className="previous-appointment-row"
                        key={
                          appointment.appointmentId
                        }
                      >

                        <div className="previous-date">
                          {formattedDate.date}{" "}
                          {formattedDate.month}{" "}
                          {formattedDate.year}
                        </div>

                        <div className="previous-info">

                          <h3>
                            {appointment.doctorName}
                          </h3>

                          <p>
                            {appointment.department}
                          </p>

                        </div>

                        <div className="previous-department">
                          {appointment.department}
                        </div>

                        <div className="previous-status">
                          {appointment.status}
                        </div>

                        <button
                          type="button"
                          className="previous-view-btn"
                          onClick={() =>
                            handleViewDetails(
                              appointment
                            )
                          }
                        >
                          View Details
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>
        </>
      )}

      {/* =========================
          VIEW DETAILS MODAL
      ========================= */}

      {selectedAppointment && (
        <div
          className="appointment-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="appointment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="appointment-modal-close"
              onClick={closeDetails}
            >
              ×
            </button>

            <div className="appointment-modal-header">

              <span>
                APPOINTMENT DETAILS
              </span>

              <h2>
                {selectedAppointment.doctorName}
              </h2>

              <p>
                {selectedAppointment.department}
              </p>

            </div>

            <div className="appointment-modal-details">

              <div>

                <strong>
                  Appointment ID
                </strong>

                <span>
                  {selectedAppointment.appointmentId}
                </span>

              </div>

              <div>

                <strong>
                  Date
                </strong>

                <span>
                  {selectedAppointment.appointmentDate}
                </span>

              </div>

              <div>

                <strong>
                  Time
                </strong>

                <span>
                  {selectedAppointment.appointmentTime}
                </span>

              </div>

              <div>

                <strong>
                  Department
                </strong>

                <span>
                  {selectedAppointment.department}
                </span>

              </div>

              <div>

                <strong>
                  Status
                </strong>

                <span>
                  {selectedAppointment.status}
                </span>

              </div>

              <div>

                <strong>
                  Reason
                </strong>

                <span>
                  {selectedAppointment.reason ||
                    "No reason provided"}
                </span>

              </div>

            </div>

            <button
              type="button"
              className="modal-done-btn"
              onClick={closeDetails}
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* =========================
          CANCEL MODAL
      ========================= */}

      {cancelAppointment && (
        <div
          className="appointment-modal-overlay"
          onClick={closeCancel}
        >

          <div
            className="appointment-modal cancel-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="appointment-modal-close"
              onClick={closeCancel}
            >
              ×
            </button>

            <div className="appointment-modal-header">

              <span>
                CANCEL APPOINTMENT
              </span>

              <h2>
                Cancel this appointment?
              </h2>

              <p>
                Your appointment with{" "}
                <strong>
                  {cancelAppointment.doctorName}
                </strong>{" "}
                is currently scheduled.
              </p>

            </div>

            <div className="cancel-modal-actions">

              <button
                type="button"
                className="keep-appointment-btn"
                onClick={closeCancel}
              >
                Keep Appointment
              </button>

              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={confirmCancellation}
              >
                Confirm Cancellation
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Appointments;