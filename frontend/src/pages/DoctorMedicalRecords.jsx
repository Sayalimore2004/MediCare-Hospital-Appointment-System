import "./DoctorMedicalRecords.css";
import { useEffect, useState } from "react";

function DoctorMedicalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddRecord, setShowAddRecord] = useState(false);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRecord, setNewRecord] = useState({
    patientId: "",
    patientName: "",
    appointmentId: "",
    department: "",
    diagnosis: "",
    recordType: "Consultation",
    notes: "",
    visitDate: "",
  });

  // ==========================================
  // GET LOGGED-IN DOCTOR
  // ==========================================

  const doctorData = JSON.parse(
    localStorage.getItem("doctorData")
  );

  const doctorId = doctorData?.doctorId;
  const doctorName = doctorData?.name;

  // ==========================================
  // FETCH DOCTOR MEDICAL RECORDS
  // ==========================================

  const fetchRecords = async () => {
    try {
      setLoading(true);

      if (!doctorId) {
        setRecords([]);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/medical-records/doctor/${doctorId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch medical records."
        );
      }

      setRecords(data);
    } catch (error) {
      console.error("Fetch Medical Records Error:", error);
      alert("Unable to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [doctorId]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      record.patientName?.toLowerCase().includes(search) ||
      record.diagnosis?.toLowerCase().includes(search) ||
      record.patientId?.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // OPEN RECORD
  // ==========================================

  const openRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeRecord = () => {
    setSelectedRecord(null);
  };

  // ==========================================
  // ADD RECORD MODAL
  // ==========================================

  const openAddRecord = () => {
    setShowAddRecord(true);
  };

  const closeAddRecord = () => {
    setShowAddRecord(false);

    setNewRecord({
      patientId: "",
      patientName: "",
      appointmentId: "",
      department: "",
      diagnosis: "",
      recordType: "Consultation",
      notes: "",
      visitDate: "",
    });
  };

  // ==========================================
  // ADD MEDICAL RECORD
  // ==========================================

  const handleAddRecord = async (event) => {
    event.preventDefault();

    if (
      newRecord.patientId.trim() === "" ||
      newRecord.patientName.trim() === "" ||
      newRecord.department.trim() === "" ||
      newRecord.diagnosis.trim() === "" ||
      newRecord.notes.trim() === "" ||
      newRecord.visitDate === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!doctorId || !doctorName) {
      alert("Doctor information not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/medical-records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: newRecord.patientId.trim(),
            patientName: newRecord.patientName.trim(),

            doctorId: doctorId,
            doctorName: doctorName,

            appointmentId: newRecord.appointmentId.trim(),

            department: newRecord.department.trim(),

            diagnosis: newRecord.diagnosis.trim(),

            recordType: newRecord.recordType,

            notes: newRecord.notes.trim(),

            visitDate: newRecord.visitDate,

            status: "Completed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create medical record."
        );
      }

      alert("Medical record added successfully.");

      closeAddRecord();

      fetchRecords();
    } catch (error) {
      console.error("Add Medical Record Error:", error);

      alert(
        error.message || "Unable to add medical record."
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRecords = records.length;

  const completedRecords = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const pendingRecords = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const patientsTreated = new Set(
    records.map((record) => record.patientId)
  ).size;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="doctor-medical-records-page">

      {/* HEADER */}

      <header className="doctor-medical-records-header">

        <div>
          <span>CLINICAL RECORDS</span>

          <h1>Medical Records</h1>

          <p>
            Review and manage medical records for patients under your care.
          </p>
        </div>

        <button
          type="button"
          className="doctor-add-record-btn"
          onClick={openAddRecord}
        >
          + Add Medical Record
        </button>

      </header>


      {/* STATISTICS */}

      <section className="doctor-record-stats">

        <div className="doctor-record-stat">
          <span>Total Records</span>
          <strong>{totalRecords}</strong>
        </div>

        <div className="doctor-record-stat">
          <span>Completed Records</span>
          <strong>{completedRecords}</strong>
        </div>

        <div className="doctor-record-stat">
          <span>Pending Records</span>
          <strong>{pendingRecords}</strong>
        </div>

        <div className="doctor-record-stat">
          <span>Patients Treated</span>
          <strong>{patientsTreated}</strong>
        </div>

      </section>


      {/* MEDICAL RECORDS */}

      <section className="doctor-medical-records-card">

        <div className="doctor-medical-records-heading">

          <div>
            <span>PATIENT RECORDS</span>
            <h2>Recent Medical Records</h2>
          </div>

          <div className="doctor-record-search">

            <input
              type="text"
              placeholder="Search patient or diagnosis..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

        </div>


        {/* TABLE */}

        <div className="doctor-record-table">

          <div className="doctor-record-table-header">

            <span>Patient</span>
            <span>Visit Date</span>
            <span>Diagnosis</span>
            <span>Record Type</span>
            <span>Status</span>
            <span>Action</span>

          </div>


          {loading ? (

            <div className="doctor-record-no-results">
              Loading medical records...
            </div>

          ) : filteredRecords.length > 0 ? (

            filteredRecords.map((record) => (

              <div
                className="doctor-record-table-row"
                key={record.recordId}
              >

                <div className="doctor-record-patient">

                  <div className="doctor-record-avatar">
                    {record.patientName
                      ?.split(" ")
                      .map((part) => part.charAt(0))
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>{record.patientName}</strong>

                    <span>
                      Patient ID: {record.patientId}
                    </span>

                  </div>

                </div>


                <span>{record.visitDate}</span>

                <span>{record.diagnosis}</span>

                <span>{record.recordType}</span>


                <span
                  className={
                    record.status === "Completed"
                      ? "doctor-record-completed"
                      : "doctor-record-pending"
                  }
                >
                  {record.status}
                </span>


                <button
                  type="button"
                  onClick={() => openRecord(record)}
                >
                  View Record
                </button>

              </div>

            ))

          ) : (

            <div className="doctor-record-no-results">
              No medical records found.
            </div>

          )}

        </div>

      </section>


      {/* CLINICAL NOTES */}

      <section className="doctor-clinical-notes-card">

        <div className="doctor-medical-records-heading">

          <div>
            <span>CLINICAL DOCUMENTATION</span>
            <h2>Recent Clinical Notes</h2>
          </div>

        </div>


        <div className="doctor-clinical-notes">

          {records.slice(0, 2).map((record) => (

            <div
              className="doctor-clinical-note"
              key={record.recordId}
            >

              <div className="doctor-record-avatar">

                {record.patientName
                  ?.split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}

              </div>

              <div>

                <strong>{record.patientName}</strong>

                <p>{record.notes}</p>

                <span>
                  {record.visitDate} · {record.recordType}
                </span>

              </div>

            </div>

          ))}

          {!loading && records.length === 0 && (

            <div className="doctor-record-no-results">
              No clinical notes available.
            </div>

          )}

        </div>

      </section>


      {/* VIEW RECORD MODAL */}

      {selectedRecord !== null && (

        <div className="doctor-record-modal-overlay">

          <div className="doctor-record-modal">

            <div className="doctor-record-modal-header">

              <div>
                <span>MEDICAL RECORD</span>

                <h2>{selectedRecord.patientName}</h2>
              </div>

              <button
                type="button"
                className="doctor-record-modal-close"
                onClick={closeRecord}
              >
                ×
              </button>

            </div>


            <div className="doctor-record-modal-profile">

              <div className="doctor-record-modal-avatar">

                {selectedRecord.patientName
                  ?.split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}

              </div>

              <div>

                <strong>{selectedRecord.patientName}</strong>

                <span>
                  Patient ID: {selectedRecord.patientId}
                </span>

              </div>

            </div>


            <div className="doctor-record-modal-details">

              <div>
                <span>VISIT DATE</span>
                <strong>{selectedRecord.visitDate}</strong>
              </div>

              <div>
                <span>RECORD TYPE</span>
                <strong>{selectedRecord.recordType}</strong>
              </div>

              <div>
                <span>DIAGNOSIS</span>
                <strong>{selectedRecord.diagnosis}</strong>
              </div>

              <div>
                <span>DEPARTMENT</span>
                <strong>{selectedRecord.department}</strong>
              </div>

              <div>
                <span>APPOINTMENT ID</span>
                <strong>
                  {selectedRecord.appointmentId || "—"}
                </strong>
              </div>

              <div>
                <span>STATUS</span>

                <strong
                  className={
                    selectedRecord.status === "Completed"
                      ? "doctor-record-modal-completed"
                      : "doctor-record-modal-pending"
                  }
                >
                  {selectedRecord.status}
                </strong>

              </div>

            </div>


            <div className="doctor-record-modal-notes">

              <span>CLINICAL NOTES</span>

              <p>{selectedRecord.notes}</p>

            </div>


            <div className="doctor-record-modal-actions">

              <button
                type="button"
                onClick={closeRecord}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ADD RECORD MODAL */}

      {showAddRecord && (

        <div className="doctor-record-modal-overlay">

          <div className="doctor-record-modal">

            <div className="doctor-record-modal-header">

              <div>
                <span>CLINICAL DOCUMENTATION</span>

                <h2>Add Medical Record</h2>
              </div>

              <button
                type="button"
                className="doctor-record-modal-close"
                onClick={closeAddRecord}
              >
                ×
              </button>

            </div>


            <form
              className="doctor-record-add-form"
              onSubmit={handleAddRecord}
            >

              <div className="doctor-record-form-field">

                <label>Patient ID</label>

                <input
                  type="text"
                  placeholder="Example: PAT1002"
                  value={newRecord.patientId}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      patientId: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Patient Name</label>

                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={newRecord.patientName}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      patientName: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Appointment ID</label>

                <input
                  type="text"
                  placeholder="Example: APT1003"
                  value={newRecord.appointmentId}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      appointmentId: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Department</label>

                <input
                  type="text"
                  placeholder="Example: Cardiology"
                  value={newRecord.department}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      department: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Diagnosis</label>

                <input
                  type="text"
                  placeholder="Enter diagnosis"
                  value={newRecord.diagnosis}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      diagnosis: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Record Type</label>

                <select
                  value={newRecord.recordType}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      recordType: event.target.value,
                    })
                  }
                >
                  <option value="Consultation">
                    Consultation
                  </option>

                  <option value="Follow-up">
                    Follow-up
                  </option>

                  <option value="Review">
                    Review
                  </option>

                  <option value="Emergency">
                    Emergency
                  </option>

                  <option value="Test Report">
                    Test Report
                  </option>

                </select>

              </div>


              <div className="doctor-record-form-field">

                <label>Visit Date</label>

                <input
                  type="date"
                  value={newRecord.visitDate}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      visitDate: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-form-field">

                <label>Clinical Notes</label>

                <textarea
                  placeholder="Enter clinical notes"
                  value={newRecord.notes}
                  onChange={(event) =>
                    setNewRecord({
                      ...newRecord,
                      notes: event.target.value,
                    })
                  }
                />

              </div>


              <div className="doctor-record-add-actions">

                <button
                  type="button"
                  onClick={closeAddRecord}
                >
                  Cancel
                </button>

                <button type="submit">
                  Add Record
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default DoctorMedicalRecords;