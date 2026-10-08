import { useEffect, useState } from "react";
import "./AdminDoctorAccess.css";

function AdminDoctorAccess() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showCredentials, setShowCredentials] = useState(false);

  const [showPasswordReset, setShowPasswordReset] =
    useState(false);

  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  const [doctors, setDoctors] = useState([]);

  const [loadingDoctors, setLoadingDoctors] =
    useState(true);

  const [error, setError] = useState("");

  const [changingAccess, setChangingAccess] =
    useState(null);

  const [resettingPassword, setResettingPassword] =
    useState(null);

  /* LOAD REAL DOCTORS FROM BACKEND */

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/doctors"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch doctors."
        );
      }

      const backendDoctors = data.map((doctor) => ({
        id: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        department: doctor.department,
        status: doctor.status,
        access: doctor.accountAccess,
      }));

      setDoctors(backendDoctors);
    } catch (error) {
      console.error(
        "Failed to fetch doctors:",
        error
      );

      setError(
        "Unable to load doctors from the backend. Please make sure the MediCare backend is running."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  /* FILTER DOCTORS */

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      doctor.name.toLowerCase().includes(search) ||
      doctor.email.toLowerCase().includes(search) ||
      doctor.specialization
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      doctor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  /* ENABLE / DISABLE DOCTOR ACCESS */

  const handleToggleAccess = async (doctor) => {
    try {
      setError("");
      setChangingAccess(doctor.id);

      const newAccess =
        doctor.access === "Enabled"
          ? "Disabled"
          : "Enabled";

      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctor.id}/access`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountAccess: newAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update doctor access."
        );
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((currentDoctor) => {
          if (currentDoctor.id !== doctor.id) {
            return currentDoctor;
          }

          return {
            ...currentDoctor,
            status: data.doctor.status,
            access: data.doctor.accountAccess,
          };
        })
      );
    } catch (error) {
      console.error(
        "Update doctor access error:",
        error
      );

      setError(
        error.message ||
          "Unable to update doctor account access."
      );
    } finally {
      setChangingAccess(null);
    }
  };

  /* VIEW CREDENTIAL INFORMATION */

  const handleViewCredentials = (doctor) => {
    setSelectedDoctor(doctor);
    setShowCredentials(true);
  };

  const handleCloseCredentials = () => {
    setSelectedDoctor(null);
    setShowCredentials(false);
  };

  const handleCopyCredentials = () => {
    if (!selectedDoctor) {
      return;
    }

    const credentials = `Doctor Login
Name: ${selectedDoctor.name}
Email: ${selectedDoctor.email}`;

    navigator.clipboard.writeText(credentials);

    alert(
      "Doctor login information copied successfully."
    );
  };

  /* RESET DOCTOR PASSWORD */

  const handleResetPassword = async (doctor) => {
    const confirmed = window.confirm(
      `Reset the password for ${doctor.name}?\n\nA new temporary password will be generated.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setResettingPassword(doctor.id);

      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctor.id}/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reset doctor password."
        );
      }

      setTemporaryPassword(
        data.temporaryPassword
      );

      setSelectedDoctor(doctor);
      setShowPasswordReset(true);
    } catch (error) {
      console.error(
        "Reset doctor password error:",
        error
      );

      setError(
        error.message ||
          "Unable to reset doctor password."
      );
    } finally {
      setResettingPassword(null);
    }
  };

  /* STATISTICS */

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active"
  ).length;

  const pendingDoctors = doctors.filter(
    (doctor) => doctor.status === "Pending"
  ).length;

  const inactiveDoctors = doctors.filter(
    (doctor) => doctor.status === "Inactive"
  ).length;

  const enabledAccounts = doctors.filter(
    (doctor) => doctor.access === "Enabled"
  ).length;

  return (
    <div className="admin-doctor-access-page">

      {/* HEADER */}

      <header className="admin-doctor-access-header">

        <div>
          <span>
            ACCOUNT ACCESS MANAGEMENT
          </span>

          <h1>
            Doctor Access
          </h1>

          <p>
            Manage doctor login access and account status.
          </p>
        </div>

      </header>

      {/* ERROR */}

      {error && (
        <div className="doctor-access-error">
          {error}

          <button
            type="button"
            onClick={fetchDoctors}
          >
            Try Again
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <section className="doctor-access-stats">

        <div className="doctor-access-stat-card">

          <div className="doctor-access-stat-icon">
            👨‍⚕️
          </div>

          <div>
            <span>Total Doctors</span>
            <strong>{doctors.length}</strong>
          </div>

        </div>

        <div className="doctor-access-stat-card">

          <div className="doctor-access-stat-icon">
            ✓
          </div>

          <div>
            <span>Active Doctors</span>
            <strong>{activeDoctors}</strong>
          </div>

        </div>

        <div className="doctor-access-stat-card">

          <div className="doctor-access-stat-icon">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingDoctors}</strong>
          </div>

        </div>

        <div className="doctor-access-stat-card">

          <div className="doctor-access-stat-icon">
            🔒
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveDoctors}</strong>
          </div>

        </div>

      </section>

      {/* ACCESS SUMMARY */}

      <section className="doctor-access-summary">

        <div className="doctor-access-summary-card">

          <div>

            <span>
              Login Accounts Enabled
            </span>

            <strong>
              {enabledAccounts}
            </strong>

            <p>
              Doctors currently allowed to access
              the system.
            </p>

          </div>

          <div className="access-summary-circle">

            {doctors.length > 0
              ? Math.round(
                  (enabledAccounts /
                    doctors.length) *
                    100
                )
              : 0}
            %

          </div>

        </div>

      </section>

      {/* SEARCH AND FILTER */}

      <section className="doctor-access-controls">

        <div className="doctor-access-search">

          <label>
            Search Doctor
          </label>

          <input
            type="text"
            placeholder="Search by name, email or specialization..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <div className="doctor-access-filter">

          <label>
            Account Status
          </label>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >

            <option value="All">
              All
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

      </section>

      {/* DOCTOR TABLE */}

      <section className="doctor-access-table-card">

        <div className="doctor-access-table-heading">

          <div>

            <span>
              DOCTOR ACCOUNTS
            </span>

            <h2>
              Login Access
            </h2>

          </div>

          <p>
            {filteredDoctors.length} doctor
            {filteredDoctors.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        <div className="doctor-access-table-wrapper">

          {loadingDoctors ? (

            <div className="doctor-access-loading">
              Loading doctors...
            </div>

          ) : (

            <table className="doctor-access-table">

              <thead>

                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Login Access</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredDoctors.length > 0 ? (

                  filteredDoctors.map((doctor) => (

                    <tr key={doctor.id}>

                      <td>

                        <div className="access-doctor-info">

                          <div className="access-doctor-avatar">

                            {doctor.name
                              .replace(
                                /^Dr\.\s*/i,
                                ""
                              )
                              .split(" ")
                              .map(
                                (name) =>
                                  name[0]
                              )
                              .join("")
                              .slice(0, 2)}

                          </div>

                          <div>

                            <strong>
                              {doctor.name}
                            </strong>

                            <span>
                              {doctor.email}
                            </span>

                            <small>
                              {doctor.id}
                            </small>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span className="access-specialization">
                          {doctor.specialization}
                        </span>

                      </td>

                      <td>
                        {doctor.department}
                      </td>

                      <td>

                        <span
                          className={`doctor-status-badge ${doctor.status.toLowerCase()}`}
                        >
                          {doctor.status}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`doctor-access-badge ${doctor.access.toLowerCase()}`}
                        >
                          ● {doctor.access}
                        </span>

                      </td>

                      <td>

                        <div className="doctor-access-actions">

                          <button
                            className="access-view-btn"
                            onClick={() =>
                              handleViewCredentials(
                                doctor
                              )
                            }
                          >
                            Credentials
                          </button>

                          <button
                            className="reset-password-btn"
                            onClick={() =>
                              handleResetPassword(
                                doctor
                              )
                            }
                            disabled={
                              resettingPassword ===
                              doctor.id
                            }
                          >
                            {resettingPassword ===
                            doctor.id
                              ? "Resetting..."
                              : "Reset Password"}
                          </button>

                          <button
                            className={
                              doctor.access ===
                              "Enabled"
                                ? "access-disable-btn"
                                : "access-enable-btn"
                            }
                            onClick={() =>
                              handleToggleAccess(
                                doctor
                              )
                            }
                            disabled={
                              changingAccess ===
                              doctor.id
                            }
                          >
                            {changingAccess ===
                            doctor.id
                              ? "Updating..."
                              : doctor.access ===
                                "Enabled"
                              ? "Disable"
                              : "Enable"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="doctor-access-empty"
                    >
                      No doctors found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          )}

        </div>

      </section>

      {/* CREDENTIALS MODAL */}

      {showCredentials &&
        selectedDoctor && (

          <div
            className="doctor-credentials-overlay"
            onClick={handleCloseCredentials}
          >

            <div
              className="doctor-credentials-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="doctor-credentials-close"
                onClick={
                  handleCloseCredentials
                }
              >
                ×
              </button>

              <div className="credentials-icon">
                🔐
              </div>

              <span className="credentials-label">
                DOCTOR LOGIN ACCESS
              </span>

              <h2>
                Doctor Account
              </h2>

              <p>
                Login information for this doctor
                account.
              </p>

              <div className="credentials-doctor">

                <div className="credentials-avatar">

                  {selectedDoctor.name
                    .replace(
                      /^Dr\.\s*/i,
                      ""
                    )
                    .split(" ")
                    .map(
                      (name) => name[0]
                    )
                    .join("")
                    .slice(0, 2)}

                </div>

                <div>

                  <strong>
                    {selectedDoctor.name}
                  </strong>

                  <span>
                    {selectedDoctor.specialization}
                  </span>

                </div>

              </div>

              <div className="credential-field">

                <label>
                  Email Address
                </label>

                <div className="credential-value">
                  {selectedDoctor.email}
                </div>

              </div>

              <div className="credential-field">

                <label>
                  Account Access
                </label>

                <div className="credential-value">
                  {selectedDoctor.access}
                </div>

              </div>

              <div className="credential-field">

                <label>
                  Account Status
                </label>

                <div className="credential-value">
                  {selectedDoctor.status}
                </div>

              </div>

              <div className="credential-note">
                🔐 The doctor's password is securely
                hashed in the backend and cannot be
                viewed after account creation.
              </div>

              <div className="credential-modal-actions">

                <button
                  className="credential-copy-btn"
                  onClick={
                    handleCopyCredentials
                  }
                >
                  Copy Login Information
                </button>

                <button
                  className="credential-close-btn"
                  onClick={
                    handleCloseCredentials
                  }
                >
                  Done
                </button>

              </div>

            </div>

          </div>

        )}

      {/* PASSWORD RESET MODAL */}

      {showPasswordReset &&
        selectedDoctor && (

          <div
            className="doctor-credentials-overlay"
            onClick={() =>
              setShowPasswordReset(false)
            }
          >

            <div
              className="password-reset-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="doctor-credentials-close"
                onClick={() =>
                  setShowPasswordReset(false)
                }
              >
                ×
              </button>

              <div className="credentials-icon">
                🔑
              </div>

              <span className="credentials-label">
                PASSWORD RESET
              </span>

              <h2>
                New Temporary Password
              </h2>

              <p>
                A new password has been generated
                for:
              </p>

              <div className="reset-doctor-name">
                {selectedDoctor.name}
              </div>

              <div className="temporary-password-box">

                <span>
                  Temporary Password
                </span>

                <strong>
                  {temporaryPassword}
                </strong>

              </div>

              <div className="password-reset-warning">
                ⚠️ Save this temporary password now.
                The password is shown only once and
                cannot be retrieved again.
              </div>

              <div className="credential-modal-actions">

                <button
                  type="button"
                  className="credential-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      temporaryPassword
                    );

                    alert(
                      "Temporary password copied successfully."
                    );
                  }}
                >
                  Copy Password
                </button>

                <button
                  type="button"
                  className="credential-close-btn"
                  onClick={() =>
                    setShowPasswordReset(false)
                  }
                >
                  Done
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default AdminDoctorAccess;