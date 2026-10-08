import "./DoctorPrescriptions.css";
import { useEffect, useState } from "react";

function DoctorPrescriptions() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    patientId: "",
    diagnosis: "",
    medication: "",
    dosage: "",
    frequency: "Once a day",
    duration: "30 Days",
    instructions: "",
  });

  // Get logged-in doctor
  const doctorData = JSON.parse(
    localStorage.getItem("doctorData") || "null"
  );

  const doctorId = doctorData?.doctorId;
  const doctorName = doctorData?.name || "Doctor";
  const department = doctorData?.department || "General";

  // Fetch prescriptions from backend
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");

      if (!doctorId) {
        setError("Doctor information not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/prescriptions/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data = await response.json();

      setPrescriptions(data);
    } catch (err) {
      console.error("Prescription fetch error:", err);
      setError("Unable to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [doctorId]);

  // Format backend prescription for existing UI
  const formatPrescription = (prescription) => {
    const parts = prescription.patientName?.trim().split(" ") || [];

    const initials =
      parts.length > 1
        ? parts[0][0] + parts[parts.length - 1][0]
        : parts[0]?.[0] || "P";

    const firstMedicine = prescription.medicines?.[0];

    return {
      id: prescription.prescriptionId,
      prescriptionId: prescription.prescriptionId,
      initials: initials.toUpperCase(),
      name: prescription.patientName,
      patientId: prescription.patientId,
      appointmentId: prescription.appointmentId,
      date: formatDate(prescription.prescriptionDate),
      diagnosis: prescription.diagnosis,
      medication: firstMedicine?.medicineName || "No medicine",
      dosage: firstMedicine
        ? `${firstMedicine.dosage} · ${firstMedicine.frequency}`
        : "Not specified",
      duration: firstMedicine?.duration || "Not specified",
      status: prescription.status,
      instructions:
        prescription.additionalInstructions ||
        firstMedicine?.instructions ||
        "No additional instructions.",
      medicines: prescription.medicines || [],
      department: prescription.department,
      doctorName: prescription.doctorName,
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Not available";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formattedPrescriptions = prescriptions.map(formatPrescription);

  // Search
  const filtered = formattedPrescriptions.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(text) ||
      item.patientId.toLowerCase().includes(text) ||
      item.diagnosis.toLowerCase().includes(text) ||
      item.medication.toLowerCase().includes(text)
    );
  });

  // Statistics
  const totalPrescriptions = prescriptions.length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const issuedThisMonth = prescriptions.filter((prescription) => {
    if (!prescription.prescriptionDate) {
      return false;
    }

    const date = new Date(prescription.prescriptionDate);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  const activePrescriptions = prescriptions.filter(
    (prescription) => prescription.status === "Active"
  ).length;

  const patientsPrescribed = new Set(
    prescriptions.map((prescription) => prescription.patientId)
  ).size;

  // Create prescription
  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.patientId ||
      !form.diagnosis ||
      !form.medication ||
      !form.dosage ||
      !form.frequency ||
      !form.duration
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!doctorId) {
      alert("Doctor information not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/prescriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: form.patientId,
            patientName: form.name,
            doctorId: doctorId,
            doctorName: doctorName,
            appointmentId: "",
            department: department,
            diagnosis: form.diagnosis,

            medicines: [
              {
                medicineName: form.medication,
                dosage: form.dosage,
                frequency: form.frequency,
                duration: form.duration,
                instructions: form.instructions,
              },
            ],

            additionalInstructions: form.instructions,
            prescriptionDate: new Date().toISOString().split("T")[0],
            status: "Active",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create prescription"
        );
      }

      alert(
        `Prescription ${data.prescription.prescriptionId} created successfully.`
      );

      // Refresh prescriptions from MongoDB
      await fetchPrescriptions();

      // Clear form
      setForm({
        name: "",
        patientId: "",
        diagnosis: "",
        medication: "",
        dosage: "",
        frequency: "Once a day",
        duration: "30 Days",
        instructions: "",
      });

      setShowCreate(false);
    } catch (err) {
      console.error("Create prescription error:", err);
      alert(err.message || "Unable to create prescription.");
    }
  };

  // Download prescription
  const downloadPrescription = (item) => {
    if (!item) {
      return;
    }

    let medicineText = "";

    item.medicines.forEach((medicine, index) => {
      medicineText += `
Medicine ${index + 1}: ${medicine.medicineName}
Dosage: ${medicine.dosage}
Frequency: ${medicine.frequency}
Duration: ${medicine.duration}
Instructions: ${medicine.instructions || "None"}

`;
    });

    const text = `
MEDICARE HOSPITAL
PRESCRIPTION

Prescription ID: ${item.prescriptionId}

Doctor: ${item.doctorName}
Department: ${item.department}

Patient: ${item.name}
Patient ID: ${item.patientId}

Date: ${item.date}

Diagnosis: ${item.diagnosis}

${medicineText}

Additional Instructions:
${item.instructions}

Status: ${item.status}
`;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.prescriptionId}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="doctor-prescriptions-page">

      {/* HEADER */}

      <header className="doctor-prescriptions-header">

        <div>
          <span>CLINICAL PRESCRIPTIONS</span>

          <h1>Prescriptions</h1>

          <p>
            Create, review and manage prescriptions for patients under your
            care.
          </p>
        </div>

        <button
          type="button"
          className="doctor-create-prescription-btn"
          onClick={() => setShowCreate(true)}
        >
          + Create Prescription
        </button>

      </header>


      {/* STATISTICS */}

      <section className="doctor-prescription-stats">

        <div className="doctor-prescription-stat">
          <span>Total Prescriptions</span>
          <strong>{totalPrescriptions}</strong>
        </div>

        <div className="doctor-prescription-stat">
          <span>Issued This Month</span>
          <strong>{issuedThisMonth}</strong>
        </div>

        <div className="doctor-prescription-stat">
          <span>Active Prescriptions</span>
          <strong>{activePrescriptions}</strong>
        </div>

        <div className="doctor-prescription-stat">
          <span>Patients Prescribed</span>
          <strong>{patientsPrescribed}</strong>
        </div>

      </section>


      {/* PRESCRIPTION TABLE */}

      <section className="doctor-prescriptions-card">

        <div className="doctor-prescriptions-heading">

          <div>
            <span>PRESCRIPTION HISTORY</span>
            <h2>Recent Prescriptions</h2>
          </div>

          <div className="doctor-prescription-search">

            <input
              type="text"
              placeholder="Search patient or medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {loading && (
          <div style={{ padding: "30px", textAlign: "center" }}>
            Loading prescriptions...
          </div>
        )}


        {!loading && error && (
          <div style={{ padding: "30px", textAlign: "center" }}>
            {error}
          </div>
        )}


        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "30px", textAlign: "center" }}>
            No prescriptions found.
          </div>
        )}


        {!loading && !error && filtered.length > 0 && (

          <div className="doctor-prescription-table">

            <div className="doctor-prescription-table-header">

              <span>Patient</span>
              <span>Date</span>
              <span>Diagnosis</span>
              <span>Medication</span>
              <span>Status</span>
              <span>Action</span>

            </div>


            {filtered.map((item) => (

              <div
                className="doctor-prescription-table-row"
                key={item.id}
              >

                <div className="doctor-prescription-patient">

                  <div className="doctor-prescription-avatar">
                    {item.initials}
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.patientId}</span>
                  </div>

                </div>

                <span>{item.date}</span>

                <span>{item.diagnosis}</span>

                <span>{item.medication}</span>

                <span
                  className={
                    item.status === "Active"
                      ? "doctor-prescription-active"
                      : "doctor-prescription-completed"
                  }
                >
                  {item.status}
                </span>

                <button
                  type="button"
                  onClick={() => setSelected(item)}
                >
                  View
                </button>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* DETAILS */}

      {formattedPrescriptions.length > 0 && (

        <section className="doctor-prescription-details-card">

          <div className="doctor-prescriptions-heading">

            <div>
              <span>RECENT PRESCRIPTION</span>
              <h2>Prescription Details</h2>
            </div>

            <span className="doctor-prescription-date">
              {selected
                ? selected.date
                : formattedPrescriptions[0].date}
            </span>

          </div>


          <div className="doctor-prescription-details">

            <div className="doctor-prescription-patient-summary">

              <div className="doctor-prescription-avatar">
                {selected
                  ? selected.initials
                  : formattedPrescriptions[0].initials}
              </div>

              <div>

                <strong>
                  {selected
                    ? selected.name
                    : formattedPrescriptions[0].name}
                </strong>

                <span>
                  Patient ID:{" "}
                  {selected
                    ? selected.patientId
                    : formattedPrescriptions[0].patientId}
                </span>

              </div>

            </div>


            <div className="doctor-medicine-list">

              {(selected
                ? selected.medicines
                : formattedPrescriptions[0].medicines
              ).map((medicine, index) => (

                <div
                  className="doctor-medicine-item"
                  key={index}
                >

                  <div>

                    <strong>{medicine.medicineName}</strong>

                    <span>
                      {medicine.dosage} · {medicine.frequency}
                    </span>

                  </div>

                  <small>{medicine.duration}</small>

                </div>

              ))}

            </div>


            <div className="doctor-prescription-instructions">

              <strong>Instructions</strong>

              <p>
                {selected
                  ? selected.instructions
                  : formattedPrescriptions[0].instructions}
              </p>

            </div>


            <button
              type="button"
              className="doctor-download-prescription-btn"
              onClick={() =>
                downloadPrescription(
                  selected || formattedPrescriptions[0]
                )
              }
            >
              Download Prescription
            </button>

          </div>

        </section>

      )}


      {/* VIEW MODAL */}

      {selected && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelected(null)}
        >

          <div
            style={{
              width: "500px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "25px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div>

                <span
                  style={{
                    color: "#168b87",
                    fontSize: "9px",
                    fontWeight: "700",
                  }}
                >
                  PRESCRIPTION DETAILS
                </span>

                <h2
                  style={{
                    margin: "6px 0 0",
                    color: "#173f3e",
                  }}
                >
                  {selected.name}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                style={{
                  border: "none",
                  background: "#f5fafa",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ×
              </button>

            </div>


            <div
              style={{
                background: "#f8fbfb",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >

              <strong>{selected.name}</strong>

              <div
                style={{
                  color: "#8a9997",
                  fontSize: "9px",
                  marginTop: "5px",
                }}
              >
                Patient ID: {selected.patientId}
              </div>

            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >

              <div>
                <small>DATE</small>
                <p>{selected.date}</p>
              </div>

              <div>
                <small>DIAGNOSIS</small>
                <p>{selected.diagnosis}</p>
              </div>

              <div>
                <small>DEPARTMENT</small>
                <p>{selected.department}</p>
              </div>

              <div>
                <small>STATUS</small>
                <p>{selected.status}</p>
              </div>

            </div>


            <div style={{ marginTop: "20px" }}>

              <strong>Medicines</strong>

              {selected.medicines.map((medicine, index) => (

                <div
                  key={index}
                  style={{
                    background: "#f8fbfb",
                    padding: "12px",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                >

                  <strong>{medicine.medicineName}</strong>

                  <p style={{ margin: "6px 0" }}>
                    {medicine.dosage} · {medicine.frequency}
                  </p>

                  <small>
                    Duration: {medicine.duration}
                  </small>

                  {medicine.instructions && (
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#657572",
                      }}
                    >
                      {medicine.instructions}
                    </p>
                  )}

                </div>

              ))}

            </div>


            <div
              style={{
                background: "#f8fbfb",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "15px",
              }}
            >

              <strong
                style={{
                  fontSize: "10px",
                  color: "#254b49",
                }}
              >
                Additional Instructions
              </strong>

              <p
                style={{
                  fontSize: "9px",
                  lineHeight: "1.6",
                  color: "#657572",
                }}
              >
                {selected.instructions}
              </p>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                type="button"
                onClick={() => downloadPrescription(selected)}
              >
                Download
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* CREATE MODAL */}

      {showCreate && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowCreate(false)}
        >

          <div
            style={{
              width: "520px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "25px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <h2
              style={{
                marginTop: 0,
                color: "#173f3e",
              }}
            >
              Create Prescription
            </h2>


            <form onSubmit={handleCreate}>

              <input
                style={inputStyle}
                placeholder="Patient Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                style={inputStyle}
                placeholder="Patient ID"
                value={form.patientId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    patientId: e.target.value,
                  })
                }
              />

              <input
                style={inputStyle}
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={(e) =>
                  setForm({
                    ...form,
                    diagnosis: e.target.value,
                  })
                }
              />

              <input
                style={inputStyle}
                placeholder="Medication"
                value={form.medication}
                onChange={(e) =>
                  setForm({
                    ...form,
                    medication: e.target.value,
                  })
                }
              />

              <input
                style={inputStyle}
                placeholder="Dosage (e.g. 500 mg)"
                value={form.dosage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dosage: e.target.value,
                  })
                }
              />

              <select
                style={inputStyle}
                value={form.frequency}
                onChange={(e) =>
                  setForm({
                    ...form,
                    frequency: e.target.value,
                  })
                }
              >
                <option>Once a day</option>
                <option>Twice a day</option>
                <option>Three times a day</option>
                <option>At bedtime</option>
                <option>As required</option>
              </select>

              <select
                style={inputStyle}
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: e.target.value,
                  })
                }
              >
                <option>7 Days</option>
                <option>15 Days</option>
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
              </select>

              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "90px",
                  resize: "vertical",
                }}
                placeholder="Instructions"
                value={form.instructions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instructions: e.target.value,
                  })
                }
              />


              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Create Prescription
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "38px",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #dfeceb",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: "10px",
  outline: "none",
  background: "#f8fbfb",
};

export default DoctorPrescriptions;