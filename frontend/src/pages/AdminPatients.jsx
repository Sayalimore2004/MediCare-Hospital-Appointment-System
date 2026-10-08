import { useEffect, useState } from "react";
import "./AdminPatients.css";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all patients from backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/patients"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();

      setPatients(data);
    } catch (error) {
      console.error("Fetch patients error:", error);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      patient.name?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.patientId?.toLowerCase().includes(search) ||
      patient.phone?.includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (patient) => patient.status === "Active"
  ).length;

  const inactivePatients = patients.filter(
    (patient) => patient.status === "Inactive"
  ).length;

  // Format date
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

  return (
    <div className="admin-patients-page">

      {/* Header */}

      <section className="admin-patients-header">

        <div>
          <span className="admin-patients-label">
            PATIENT MANAGEMENT
          </span>

          <h1>Patients</h1>

          <p>
            View and manage patients registered with MediCare.
          </p>
        </div>

      </section>


      {/* Statistics */}

      <section className="admin-patients-stats">

        <div className="admin-patient-stat-card">

          <div className="admin-patient-stat-icon">
            👤
          </div>

          <div>
            <span>Total Patients</span>
            <strong>{totalPatients}</strong>
          </div>

        </div>


        <div className="admin-patient-stat-card">

          <div className="admin-patient-stat-icon">
            🟢
          </div>

          <div>
            <span>Active Patients</span>
            <strong>{activePatients}</strong>
          </div>

        </div>


        <div className="admin-patient-stat-card">

          <div className="admin-patient-stat-icon">
            ⚪
          </div>

          <div>
            <span>Inactive Patients</span>
            <strong>{inactivePatients}</strong>
          </div>

        </div>

      </section>


      {/* Patient Management */}

      <section className="admin-patients-card">

        {/* Heading */}

        <div className="admin-patients-card-heading">

          <div>
            <span>PATIENT RECORDS</span>
            <h2>Registered Patients</h2>
          </div>

        </div>


        {/* Filters */}

        <div className="admin-patients-filters">

          <input
            type="text"
            placeholder="Search by name, ID, email or phone..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>


        {/* Loading */}

        {loading && (
          <div className="admin-patients-message">
            Loading patients...
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="admin-patients-message">
            {error}
          </div>
        )}


        {/* No patients */}

        {!loading &&
          !error &&
          filteredPatients.length === 0 && (
            <div className="admin-patients-message">
              No patients found.
            </div>
          )}


        {/* Patients Table */}

        {!loading &&
          !error &&
          filteredPatients.length > 0 && (

            <div className="admin-patients-table-wrapper">

              <table className="admin-patients-table">

                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Birth</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredPatients.map((patient) => (

                    <tr key={patient.patientId}>

                      <td>
                        <strong>{patient.patientId}</strong>
                      </td>


                      <td>
                        <div className="admin-patient-name">

                          <div className="admin-patient-avatar">
                            {patient.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>{patient.name}</span>

                        </div>
                      </td>


                      <td>{patient.email}</td>


                      <td>{patient.phone}</td>


                      <td>
                        {formatDate(patient.dateOfBirth)}
                      </td>


                      <td>

                        <span
                          className={`admin-patient-status ${
                            patient.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {patient.status}
                        </span>

                      </td>


                      <td>

                        <button
                          className="admin-patient-view-btn"
                          onClick={() =>
                            setSelectedPatient(patient)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

      </section>


      {/* Patient Details Modal */}

      {selectedPatient && (

        <div
          className="admin-patient-modal-overlay"
          onClick={() => setSelectedPatient(null)}
        >

          <div
            className="admin-patient-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-patient-modal-header">

              <div>
                <span>PATIENT DETAILS</span>
                <h2>{selectedPatient.name}</h2>
              </div>

              <button
                className="admin-patient-modal-close"
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                ×
              </button>

            </div>


            <div className="admin-patient-modal-body">

              <div className="admin-patient-detail-item">
                <span>Patient ID</span>
                <strong>
                  {selectedPatient.patientId}
                </strong>
              </div>


              <div className="admin-patient-detail-item">
                <span>Email</span>
                <strong>
                  {selectedPatient.email}
                </strong>
              </div>


              <div className="admin-patient-detail-item">
                <span>Phone</span>
                <strong>
                  {selectedPatient.phone}
                </strong>
              </div>


              <div className="admin-patient-detail-item">
                <span>Date of Birth</span>
                <strong>
                  {formatDate(
                    selectedPatient.dateOfBirth
                  )}
                </strong>
              </div>


              <div className="admin-patient-detail-item">
                <span>Account Status</span>
                <strong>
                  {selectedPatient.status}
                </strong>
              </div>


              <div className="admin-patient-detail-item">
                <span>Registered On</span>
                <strong>
                  {formatDate(
                    selectedPatient.createdAt
                  )}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminPatients;
