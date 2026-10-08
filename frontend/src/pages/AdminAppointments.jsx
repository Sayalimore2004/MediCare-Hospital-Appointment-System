import { useEffect, useState } from "react";
import "./AdminAppointments.css";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/appointments"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      setError("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        appointment.appointmentId
          ?.toLowerCase()
          .includes(search) ||
        appointment.patientName
          ?.toLowerCase()
          .includes(search) ||
        appointment.patientId
          ?.toLowerCase()
          .includes(search) ||
        appointment.doctorName
          ?.toLowerCase()
          .includes(search) ||
        appointment.doctorId
          ?.toLowerCase()
          .includes(search) ||
        appointment.department
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "confirmed";

      case "Completed":
        return "completed";

      case "Cancelled":
        return "cancelled";

      case "Rejected":
        return "rejected";

      default:
        return "pending";
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setStatusMessage("");
    setStatusError("");
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setNewStatus("");
    setStatusMessage("");
    setStatusError("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppointment) {
      return;
    }

    if (newStatus === selectedAppointment.status) {
      setStatusError(
        "Please select a different status."
      );
      return;
    }

    try {
      setUpdatingStatus(true);
      setStatusMessage("");
      setStatusError("");

      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppointment.appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update appointment status."
        );
      }

      const updatedStatus =
        data.appointment?.status ||
        data.status ||
        newStatus;

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.appointmentId ===
          selectedAppointment.appointmentId
            ? {
                ...appointment,
                status: updatedStatus,
              }
            : appointment
        )
      );

      setSelectedAppointment((currentAppointment) => ({
        ...currentAppointment,
        status: updatedStatus,
      }));

      setNewStatus(updatedStatus);

      setStatusMessage(
        "Appointment status updated successfully."
      );
    } catch (error) {
      console.error(
        "Update appointment status error:",
        error
      );

      setStatusError(
        error.message ||
          "Failed to update appointment status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="admin-appointments-page">

      {/* HEADER */}

      <section className="admin-appointments-header">
        <div>
          <span className="admin-appointments-label">
            APPOINTMENT MANAGEMENT
          </span>

          <h1>Appointments</h1>

          <p>
            View and manage appointments booked through
            MediCare.
          </p>
        </div>
      </section>


      {/* STATISTICS */}

      <section className="admin-appointments-stats">

        <div className="admin-appointment-stat-card">
          <div className="admin-appointment-stat-icon">
            📅
          </div>

          <div>
            <span>Total Appointments</span>
            <strong>{totalAppointments}</strong>
          </div>
        </div>

        <div className="admin-appointment-stat-card">
          <div className="admin-appointment-stat-icon">
            🟡
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingAppointments}</strong>
          </div>
        </div>

        <div className="admin-appointment-stat-card">
          <div className="admin-appointment-stat-icon">
            🟢
          </div>

          <div>
            <span>Confirmed</span>
            <strong>{confirmedAppointments}</strong>
          </div>
        </div>

        <div className="admin-appointment-stat-card">
          <div className="admin-appointment-stat-icon">
            🔵
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedAppointments}</strong>
          </div>
        </div>

        <div className="admin-appointment-stat-card">
          <div className="admin-appointment-stat-icon">
            🔴
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{cancelledAppointments}</strong>
          </div>
        </div>

      </section>


      {/* APPOINTMENT RECORDS */}

      <section className="admin-appointments-card">

        <div className="admin-appointments-card-heading">
          <div>
            <span>APPOINTMENT RECORDS</span>
            <h2>All Appointments</h2>
          </div>
        </div>


        {/* FILTERS */}

        <div className="admin-appointments-filters">

          <input
            type="text"
            placeholder="Search by appointment, patient, doctor or department..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-appointments-message">
            Loading appointments...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="admin-appointments-message">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredAppointments.length === 0 && (
            <div className="admin-appointments-message">
              No appointments found.
            </div>
          )}


        {/* TABLE */}

        {!loading &&
          !error &&
          filteredAppointments.length > 0 && (
            <div className="admin-appointments-table-wrapper">

              <table className="admin-appointments-table">

                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.appointmentId}
                      >

                        <td>
                          <strong>
                            {appointment.appointmentId}
                          </strong>
                        </td>

                        <td>
                          <div className="admin-appointment-person">

                            <div className="admin-appointment-avatar">
                              {appointment.patientName
                                ?.charAt(0)
                                .toUpperCase()}
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
                        </td>

                        <td>
                          <div className="admin-appointment-person">

                            <div className="admin-appointment-avatar doctor">
                              👨‍⚕️
                            </div>

                            <div>
                              <strong>
                                {appointment.doctorName}
                              </strong>

                              <span>
                                {appointment.doctorId}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {appointment.department}
                        </td>

                        <td>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </td>

                        <td>
                          {appointment.appointmentTime}
                        </td>

                        <td>
                          <span
                            className={`admin-appointment-status ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="admin-appointment-view-btn"
                            onClick={() =>
                              handleViewAppointment(
                                appointment
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>


      {/* VIEW APPOINTMENT MODAL */}

      {selectedAppointment && (
        <div
          className="admin-appointment-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="admin-appointment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-appointment-modal-header">

              <div>
                <span>APPOINTMENT DETAILS</span>

                <h2>
                  {selectedAppointment.appointmentId}
                </h2>
              </div>

              <button
                className="admin-appointment-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* APPOINTMENT INFORMATION */}

            <div className="admin-appointment-modal-body">

              <div className="admin-appointment-detail-item">
                <span>Appointment ID</span>

                <strong>
                  {selectedAppointment.appointmentId}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Status</span>

                <strong>
                  <span
                    className={`admin-appointment-status ${getStatusClass(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Patient</span>

                <strong>
                  {selectedAppointment.patientName}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Patient ID</span>

                <strong>
                  {selectedAppointment.patientId}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Doctor</span>

                <strong>
                  {selectedAppointment.doctorName}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Doctor ID</span>

                <strong>
                  {selectedAppointment.doctorId}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Department</span>

                <strong>
                  {selectedAppointment.department}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Appointment Date</span>

                <strong>
                  {formatDate(
                    selectedAppointment.appointmentDate
                  )}
                </strong>
              </div>


              <div className="admin-appointment-detail-item">
                <span>Appointment Time</span>

                <strong>
                  {selectedAppointment.appointmentTime}
                </strong>
              </div>


              <div className="admin-appointment-detail-item full">
                <span>Reason for Visit</span>

                <strong>
                  {selectedAppointment.reason || "-"}
                </strong>
              </div>


              {/* MANAGE APPOINTMENT STATUS */}

              <div
                className="admin-appointment-status-management"
              >

                <div className="admin-status-management-heading">

                  <span>MANAGE APPOINTMENT</span>

                  <h3>
                    Update Appointment Status
                  </h3>

                </div>


                <label>
                  Select New Status
                </label>

                <select
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(event.target.value)
                  }
                  disabled={updatingStatus}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>


                {statusMessage && (
                  <div className="admin-appointment-success-message">
                    {statusMessage}
                  </div>
                )}


                {statusError && (
                  <div className="admin-appointment-error-message">
                    {statusError}
                  </div>
                )}


                <button
                  type="button"
                  className="admin-appointment-update-btn"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                >
                  {updatingStatus
                    ? "Updating..."
                    : "Update Status"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminAppointments;
