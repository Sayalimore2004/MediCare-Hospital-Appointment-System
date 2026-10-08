import { useEffect, useState } from "react";
import "./MedicalRecords.css";

function MedicalRecords() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in patient
  const patientData = JSON.parse(
    localStorage.getItem("patientData") || "null"
  );

  const patientId = patientData?.patientId;

  // Fetch medical records from backend
  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      if (!patientId) {
        setError("Patient information not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/medical-records/patient/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch medical records");
      }

      const data = await response.json();

      setMedicalRecords(data);
    } catch (err) {
      console.error("Medical records error:", err);
      setError("Unable to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [patientId]);

  // Convert date into month/day/year
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return {
        month: "",
        day: "",
        year: "",
      };
    }

    return {
      month: date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase(),
      day: String(date.getDate()).padStart(2, "0"),
      year: date.getFullYear(),
    };
  };

  // Convert backend record into UI format
  const formatRecord = (record) => {
    const formattedDate = formatDate(record.visitDate);

    return {
      id: record.recordId,
      recordId: record.recordId,
      month: formattedDate.month,
      day: formattedDate.day,
      year: formattedDate.year,
      doctor: record.doctorName,
      specialty: record.department,
      avatar: record.doctorName?.toLowerCase().includes("dr.")
        ? "👨‍⚕️"
        : "👨‍⚕️",
      department: record.department,
      diagnosis: record.diagnosis,
      visitType: record.recordType,
      status: record.status,
      notes: record.notes,
      appointmentId: record.appointmentId,
    };
  };

  const formattedRecords = medicalRecords.map(formatRecord);

  // Summary counts
  const totalRecords = medicalRecords.length;

  const consultations = medicalRecords.filter(
    (record) => record.recordType === "Consultation"
  ).length;

  const testReports = medicalRecords.filter(
    (record) => record.recordType === "Test Report"
  ).length;

  const openRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeRecord = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="medical-records-page">

      {/* Page Header */}

      <section className="medical-records-header">
        <div>
          <span className="medical-records-label">
            PATIENT MEDICAL RECORDS
          </span>

          <h1>Medical Records</h1>

          <p>
            View your medical history, diagnoses, consultation notes and
            healthcare records in one place.
          </p>
        </div>
      </section>


      {/* Main Content */}

      <section className="medical-records-content">

        {/* Summary */}

        <div className="medical-record-summary">

          <div className="record-summary-card">
            <div className="record-summary-icon">📋</div>

            <div>
              <span>Total Records</span>
              <strong>{totalRecords}</strong>
            </div>
          </div>

          <div className="record-summary-card">
            <div className="record-summary-icon">🩺</div>

            <div>
              <span>Consultations</span>
              <strong>{consultations}</strong>
            </div>
          </div>

          <div className="record-summary-card">
            <div className="record-summary-icon">🧪</div>

            <div>
              <span>Test Reports</span>
              <strong>{testReports}</strong>
            </div>
          </div>

        </div>


        {/* Medical History */}

        <section className="medical-history-section">

          <div className="medical-section-heading">

            <div>
              <span>HEALTHCARE HISTORY</span>
              <h2>Recent Medical Records</h2>
            </div>

            <span className="record-count">
              {totalRecords} {totalRecords === 1 ? "Record" : "Records"}
            </span>

          </div>


          {/* Loading */}

          {loading && (
            <div className="medical-record-empty">
              Loading medical records...
            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="medical-record-empty">
              {error}
            </div>
          )}


          {/* No Records */}

          {!loading && !error && formattedRecords.length === 0 && (
            <div className="medical-record-empty">
              No medical records found.
            </div>
          )}


          {/* Records */}

          {!loading && !error && formattedRecords.length > 0 && (
            <div className="medical-record-list">

              {formattedRecords.map((record) => (

                <div
                  className="medical-record-card"
                  key={record.id}
                >

                  <div className="record-date">
                    <span>{record.month}</span>
                    <strong>{record.day}</strong>
                    <small>{record.year}</small>
                  </div>


                  <div className="record-main">

                    <div className="record-doctor">

                      <div className="record-doctor-avatar">
                        {record.avatar}
                      </div>

                      <div>
                        <h3>{record.doctor}</h3>
                        <p>{record.specialty}</p>
                      </div>

                    </div>


                    <div className="record-details">

                      <div>
                        <span>Department</span>
                        <strong>{record.department}</strong>
                      </div>

                      <div>
                        <span>Diagnosis</span>
                        <strong>{record.diagnosis}</strong>
                      </div>

                      <div>
                        <span>Visit Type</span>
                        <strong>{record.visitType}</strong>
                      </div>

                    </div>

                  </div>


                  <div className="record-action">

                    <span className="record-status">
                      {record.status}
                    </span>

                    <button
                      type="button"
                      className="record-view-btn"
                      onClick={() => openRecord(record)}
                    >
                      View Record
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </section>


      {/* Medical Record Modal */}

      {selectedRecord && (

        <div
          className="medical-record-modal-overlay"
          onClick={closeRecord}
        >

          <div
            className="medical-record-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="medical-record-modal-header">

              <div>
                <span>MEDICAL RECORD</span>
                <h2>Medical Record Details</h2>
              </div>

              <button
                type="button"
                className="medical-record-modal-close"
                onClick={closeRecord}
                aria-label="Close medical record"
              >
                ×
              </button>

            </div>


            {/* Doctor Information */}

            <div className="medical-record-modal-doctor">

              <div className="medical-record-modal-avatar">
                {selectedRecord.avatar}
              </div>

              <div>
                <h3>{selectedRecord.doctor}</h3>
                <p>{selectedRecord.specialty}</p>
              </div>

            </div>


            {/* Record Information */}

            <div className="medical-record-modal-info">

              <div>
                <span>Visit Date</span>

                <strong>
                  {selectedRecord.day} {selectedRecord.month}{" "}
                  {selectedRecord.year}
                </strong>
              </div>


              <div>
                <span>Department</span>
                <strong>{selectedRecord.department}</strong>
              </div>


              <div>
                <span>Diagnosis</span>
                <strong>{selectedRecord.diagnosis}</strong>
              </div>


              <div>
                <span>Visit Type</span>
                <strong>{selectedRecord.visitType}</strong>
              </div>


              <div>
                <span>Status</span>
                <strong>{selectedRecord.status}</strong>
              </div>

            </div>


            {/* Consultation Notes */}

            <div className="medical-record-modal-notes">

              <span>CONSULTATION NOTES</span>

              <p>
                {selectedRecord.notes}
              </p>

            </div>


            {/* Modal Footer */}

            <div className="medical-record-modal-actions">

              <button
                type="button"
                className="medical-record-close-btn"
                onClick={closeRecord}
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

export default MedicalRecords;