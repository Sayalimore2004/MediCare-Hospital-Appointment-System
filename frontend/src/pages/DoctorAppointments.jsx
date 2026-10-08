import "./DoctorAppointments.css";
import { useEffect, useState } from "react";

function DoctorAppointments() {

  const [appointments, setAppointments] = useState([]);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================
     FETCH DOCTOR APPOINTMENTS
     ========================================= */

  const fetchAppointments = async () => {

    try {

      setLoading(true);
      setError("");

      const doctorData =
        JSON.parse(
          localStorage.getItem("doctorData")
        );

      /* CHECK DOCTOR LOGIN */

      if (!doctorData) {

        setError(
          "Please login as a doctor to view appointments."
        );

        setLoading(false);

        return;
      }

      /* GET DOCTOR ID */

      const doctorId =
        doctorData.doctorId;

      if (!doctorId) {

        setError(
          "Doctor information is not available."
        );

        setLoading(false);

        return;
      }

      /* FETCH APPOINTMENTS */

      const response =
        await fetch(
          `http://localhost:5000/api/appointments/doctor/${doctorId}`
        );

      const data =
        await response.json();

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
        "Fetch doctor appointments error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the MediCare backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     LOAD APPOINTMENTS
     ========================================= */

  useEffect(() => {

    fetchAppointments();

  }, []);


  /* =========================================
     FORMAT DATE
     ========================================= */

  const formatDate = (dateString) => {

    if (!dateString) {
      return "Date not available";
    }

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  /* =========================================
     CHECK TODAY'S APPOINTMENTS
     ========================================= */

  const isToday = (dateString) => {

    if (!dateString) {
      return false;
    }

    const today =
      new Date();

    const appointmentDate =
      new Date(
        `${dateString}T00:00:00`
      );

    return (
      today.getFullYear() ===
        appointmentDate.getFullYear() &&
      today.getMonth() ===
        appointmentDate.getMonth() &&
      today.getDate() ===
        appointmentDate.getDate()
    );
  };


  /* =========================================
     SEARCH + FILTER
     ========================================= */

  const filteredAppointments =
    appointments.filter(
      (appointment) => {

        const patientName =
          appointment.patientName ||
          "";

        const consultation =
          appointment.reason ||
          appointment.department ||
          "";

        const matchesSearch =
          patientName
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          consultation
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "All" ||
          appointment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );


  /* =========================================
     UPDATE APPOINTMENT STATUS
     ========================================= */

  const updateAppointmentStatus =
    async (
      appointmentId,
      status
    ) => {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/appointments/${appointmentId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                status
              })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(
            data.message ||
            "Failed to update appointment."
          );

          return false;
        }

        await fetchAppointments();

        return true;

      } catch (error) {

        console.error(
          "Update appointment status error:",
          error
        );

        alert(
          "Unable to connect to the server."
        );

        return false;
      }
    };


  /* =========================================
     CONFIRM APPOINTMENT
     ========================================= */

  const handleConfirm =
    async (appointmentId) => {

      const success =
        await updateAppointmentStatus(
          appointmentId,
          "Confirmed"
        );

      if (success) {

        setSelectedAppointment(
          (previous) =>
            previous
              ? {
                  ...previous,
                  status:
                    "Confirmed"
                }
              : null
        );

      }
    };


  /* =========================================
     COMPLETE APPOINTMENT
     ========================================= */

  const handleComplete =
    async (appointmentId) => {

      const success =
        await updateAppointmentStatus(
          appointmentId,
          "Completed"
        );

      if (success) {

        setSelectedAppointment(
          (previous) =>
            previous
              ? {
                  ...previous,
                  status:
                    "Completed"
                }
              : null
        );

      }
    };


  /* =========================================
     CANCEL APPOINTMENT
     ========================================= */

  const handleCancel =
    async (appointmentId) => {

      const success =
        await updateAppointmentStatus(
          appointmentId,
          "Cancelled"
        );

      if (success) {

        setSelectedAppointment(
          (previous) =>
            previous
              ? {
                  ...previous,
                  status:
                    "Cancelled"
                }
              : null
        );

      }
    };


  /* =========================================
     STATISTICS
     ========================================= */

  const todayCount =
    appointments.filter(
      (appointment) =>
        isToday(
          appointment.appointmentDate
        )
    ).length;

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "Confirmed"
    ).length;

  const pendingCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "Pending"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "Cancelled"
    ).length;


  return (

    <div className="doctor-appointments-page">


      {/* =========================================
          HEADER
          ========================================= */}

      <header className="doctor-appointments-header">

        <div>

          <span>
            DOCTOR APPOINTMENTS
          </span>

          <h1>
            Appointments
          </h1>

          <p>
            View and manage your scheduled patient appointments and
            consultation details.
          </p>

        </div>

      </header>


      {/* =========================================
          ERROR
          ========================================= */}

      {error && (

        <div className="appointment-error">
          {error}
        </div>

      )}


      {/* =========================================
          SUMMARY
          ========================================= */}

      <section className="doctor-appointment-stats">

        <div className="doctor-appointment-stat">

          <span>
            Today's Appointments
          </span>

          <strong>
            {todayCount}
          </strong>

        </div>


        <div className="doctor-appointment-stat">

          <span>
            Confirmed
          </span>

          <strong>
            {confirmedCount}
          </strong>

        </div>


        <div className="doctor-appointment-stat">

          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>

        </div>


        <div className="doctor-appointment-stat">

          <span>
            Cancelled
          </span>

          <strong>
            {cancelledCount}
          </strong>

        </div>

      </section>


      {/* =========================================
          APPOINTMENTS
          ========================================= */}

      <section className="doctor-appointments-card">


        {/* CARD HEADING */}

        <div className="doctor-appointments-card-heading">

          <div>

            <span>
              APPOINTMENTS
            </span>

            <h2>
              Patient Appointments
            </h2>

          </div>

          <span className="doctor-appointments-date">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }
            )}
          </span>

        </div>


        {/* SEARCH + FILTER */}

        <div className="doctor-appointment-controls">

          <input
            type="text"
            placeholder="Search patient or consultation..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </select>

        </div>


        {/* TABLE */}

        <div className="doctor-appointment-table">

          <div className="doctor-appointment-table-header">

            <span>
              Patient
            </span>

            <span>
              Consultation
            </span>

            <span>
              Time
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>

          </div>


          {loading ? (

            <div className="doctor-no-appointments">

              Loading appointments...

            </div>

          ) : filteredAppointments.length >
            0 ? (

            filteredAppointments.map(
              (appointment) => {

                const initials =
                  appointment.patientName
                    ? appointment.patientName
                        .split(" ")
                        .map(
                          (name) =>
                            name.charAt(0)
                        )
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "PT";

                return (

                  <div
                    className="doctor-appointment-row"
                    key={
                      appointment.appointmentId
                    }
                  >

                    {/* PATIENT */}

                    <div className="doctor-appointment-patient">

                      <div>
                        {initials}
                      </div>

                      <section>

                        <strong>
                          {
                            appointment.patientName
                          }
                        </strong>

                        <span>
                          Patient ID:{" "}
                          {
                            appointment.patientId
                          }
                        </span>

                      </section>

                    </div>


                    {/* CONSULTATION */}

                    <span>

                      {
                        appointment.reason ||
                        appointment.department ||
                        "General Consultation"
                      }

                    </span>


                    {/* TIME */}

                    <strong>

                      {
                        appointment.appointmentTime
                      }

                    </strong>


                    {/* STATUS */}

                    <span
                      className={
                        appointment.status ===
                        "Confirmed"
                          ? "appointment-confirmed"
                          : appointment.status ===
                            "Pending"
                          ? "appointment-pending"
                          : appointment.status ===
                            "Completed"
                          ? "appointment-completed"
                          : "appointment-cancelled"
                      }
                    >

                      {
                        appointment.status
                      }

                    </span>


                    {/* ACTION */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAppointment(
                          appointment
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                );
              }
            )

          ) : (

            <div className="doctor-no-appointments">

              No appointments found.

            </div>

          )}

        </div>

      </section>


      {/* =========================================
          UPCOMING APPOINTMENTS
          ========================================= */}

      <section className="doctor-appointments-card upcoming-doctor-appointments">

        <div className="doctor-appointments-card-heading">

          <div>

            <span>
              UPCOMING
            </span>

            <h2>
              Upcoming Appointments
            </h2>

          </div>

        </div>


        {appointments.filter(
          (appointment) =>
            appointment.appointmentDate >=
              new Date()
                .toISOString()
                .split("T")[0] &&
            appointment.status !==
              "Cancelled" &&
            appointment.status !==
              "Completed" &&
            appointment.status !==
              "Rejected"
        ).length > 0 ? (

          <div className="upcoming-appointment-list">

            {appointments
              .filter(
                (appointment) =>
                  appointment.appointmentDate >=
                    new Date()
                      .toISOString()
                      .split("T")[0] &&
                  appointment.status !==
                    "Cancelled" &&
                  appointment.status !==
                    "Completed" &&
                  appointment.status !==
                    "Rejected"
              )
              .map(
                (appointment) => {

                  const date =
                    new Date(
                      `${appointment.appointmentDate}T00:00:00`
                    );

                  return (

                    <div
                      className="upcoming-appointment-item"
                      key={
                        appointment.appointmentId
                      }
                    >

                      <div className="upcoming-date">

                        <strong>
                          {date.getDate()}
                        </strong>

                        <span>
                          {date
                            .toLocaleString(
                              "en-IN",
                              {
                                month:
                                  "short"
                              }
                            )
                            .toUpperCase()}
                        </span>

                      </div>


                      <div>

                        <strong>
                          {
                            appointment.patientName
                          }
                        </strong>

                        <span>
                          {
                            appointment.reason ||
                            appointment.department
                          }
                        </span>

                      </div>


                      <strong>
                        {
                          appointment.appointmentTime
                        }
                      </strong>


                      <span
                        className={
                          appointment.status ===
                          "Confirmed"
                            ? "appointment-confirmed"
                            : "appointment-pending"
                        }
                      >
                        {
                          appointment.status
                        }
                      </span>

                    </div>

                  );
                }
              )}

          </div>

        ) : (

          <div className="doctor-no-appointments">

            No upcoming appointments.

          </div>

        )}

      </section>


      {/* =========================================
          APPOINTMENT DETAILS MODAL
          ========================================= */}

      {selectedAppointment && (

        <div
          className="doctor-appointment-modal-overlay"
          onClick={() =>
            setSelectedAppointment(
              null
            )
          }
        >

          <div
            className="doctor-appointment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="doctor-appointment-modal-header">

              <div>

                <span>
                  APPOINTMENT DETAILS
                </span>

                <h2>
                  {
                    selectedAppointment.patientName
                  }
                </h2>

              </div>


              <button
                type="button"
                className="doctor-modal-close"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            {/* PATIENT */}

            <div className="doctor-modal-patient">

              <div className="doctor-modal-avatar">

                {selectedAppointment.patientName
                  ? selectedAppointment.patientName
                      .split(" ")
                      .map(
                        (name) =>
                          name.charAt(0)
                      )
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "PT"}

              </div>


              <div>

                <strong>
                  {
                    selectedAppointment.patientName
                  }
                </strong>

                <span>
                  Patient ID:{" "}
                  {
                    selectedAppointment.patientId
                  }
                </span>

              </div>

            </div>


            {/* DETAILS */}

            <div className="doctor-modal-details">


              <div>

                <span>
                  APPOINTMENT ID
                </span>

                <strong>
                  {
                    selectedAppointment.appointmentId
                  }
                </strong>

              </div>


              <div>

                <span>
                  CONSULTATION
                </span>

                <strong>
                  {
                    selectedAppointment.reason ||
                    selectedAppointment.department ||
                    "General Consultation"
                  }
                </strong>

              </div>


              <div>

                <span>
                  DEPARTMENT
                </span>

                <strong>
                  {
                    selectedAppointment.department
                  }
                </strong>

              </div>


              <div>

                <span>
                  DATE
                </span>

                <strong>
                  {
                    formatDate(
                      selectedAppointment.appointmentDate
                    )
                  }
                </strong>

              </div>


              <div>

                <span>
                  TIME
                </span>

                <strong>
                  {
                    selectedAppointment.appointmentTime
                  }
                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong
                  className={
                    selectedAppointment.status ===
                    "Confirmed"
                      ? "doctor-modal-status-confirmed"
                      : selectedAppointment.status ===
                        "Pending"
                      ? "doctor-modal-status-pending"
                      : selectedAppointment.status ===
                        "Completed"
                      ? "doctor-modal-status-completed"
                      : "doctor-modal-status-cancelled"
                  }
                >
                  {
                    selectedAppointment.status
                  }
                </strong>

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="doctor-modal-actions">


              {selectedAppointment.status ===
                "Pending" && (

                <button
                  type="button"
                  className="doctor-modal-confirm-btn"
                  onClick={() =>
                    handleConfirm(
                      selectedAppointment.appointmentId
                    )
                  }
                >
                  Confirm Appointment
                </button>

              )}


              {selectedAppointment.status ===
                "Confirmed" && (

                <button
                  type="button"
                  className="doctor-modal-complete-btn"
                  onClick={() =>
                    handleComplete(
                      selectedAppointment.appointmentId
                    )
                  }
                >
                  Mark as Completed
                </button>

              )}


              {selectedAppointment.status !==
                "Cancelled" &&
                selectedAppointment.status !==
                  "Completed" && (
                <button
                  type="button"
                  className="doctor-modal-cancel-appointment-btn"
                  onClick={() =>
                    handleCancel(
                      selectedAppointment.appointmentId
                    )
                  }
                >
                  Cancel Appointment
                </button>
              )}


              <button
                type="button"
                className="doctor-modal-cancel-btn"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
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

export default DoctorAppointments;