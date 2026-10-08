import { useEffect, useState } from "react";
import "./Prescriptions.css";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientData = JSON.parse(
    localStorage.getItem("patientData") || "null"
  );

  const patientId = patientData?.patientId;

  // Fetch prescriptions from backend
  const fetchPrescriptions = async () => {
    if (!patientId) {
      setError("Patient information not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/prescriptions/patient/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions.");
      }

      const data = await response.json();

      setPrescriptions(data);
    } catch (err) {
      console.error("Prescription fetch error:", err);
      setError("Unable to load prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";

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

  // Open prescription
  const openPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  // Close prescription
  const closePrescription = () => {
    setSelectedPrescription(null);
  };

  // Download / print prescription
  const downloadPrescription = (prescription) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Please allow pop-ups in your browser to download the prescription."
      );
      return;
    }

    const medicinesHTML = prescription.medicines
      .map(
        (medicine) => `
          <tr>
            <td>${medicine.medicineName || "-"}</td>
            <td>${medicine.dosage || "-"}</td>
            <td>${medicine.frequency || "-"}</td>
            <td>${medicine.duration || "-"}</td>
            <td>${medicine.instructions || "-"}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MediCare Prescription</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #1f2937;
              line-height: 1.5;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #0f766e;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            .header h1 {
              margin: 0;
              color: #0f766e;
              font-size: 28px;
            }

            .header p {
              margin: 5px 0;
              color: #64748b;
            }

            .section {
              margin-bottom: 25px;
            }

            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0f766e;
              margin-bottom: 10px;
            }

            .info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              background: #f8fafc;
              padding: 18px;
              border-radius: 8px;
            }

            .info strong {
              display: block;
              margin-top: 3px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th,
            td {
              border: 1px solid #dbe3ea;
              padding: 10px;
              text-align: left;
              font-size: 13px;
            }

            th {
              background: #f1f5f9;
            }

            .instructions {
              background: #f8fafc;
              padding: 15px;
              border-left: 4px solid #0f766e;
            }

            .footer {
              margin-top: 50px;
              text-align: center;
              color: #64748b;
              font-size: 12px;
              border-top: 1px solid #dbe3ea;
              padding-top: 15px;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>

          <div class="header">
            <h1>MediCare Hospital</h1>
            <p>Patient Prescription</p>
          </div>

          <div class="section">
            <div class="section-title">Prescription Details</div>

            <div class="info">

              <div>
                Doctor
                <strong>${prescription.doctorName || "-"}</strong>
              </div>

              <div>
                Department
                <strong>${prescription.department || "-"}</strong>
              </div>

              <div>
                Prescribed On
                <strong>${formatDate(
                  prescription.prescriptionDate
                )}</strong>
              </div>

              <div>
                Diagnosis
                <strong>${prescription.diagnosis || "-"}</strong>
              </div>

              <div>
                Prescription ID
                <strong>${prescription.prescriptionId || "-"}</strong>
              </div>

              <div>
                Status
                <strong>${prescription.status || "-"}</strong>
              </div>

            </div>
          </div>

          <div class="section">

            <div class="section-title">
              Medicines
            </div>

            <table>

              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>

              <tbody>
                ${medicinesHTML}
              </tbody>

            </table>

          </div>

          <div class="section">

            <div class="section-title">
              Doctor's Instructions
            </div>

            <div class="instructions">
              ${prescription.additionalInstructions || "No additional instructions."}
            </div>

          </div>

          <div class="footer">
            MediCare Hospital<br />
            This is a system-generated prescription document.
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  // Summary values
  const totalPrescriptions = prescriptions.length;

  const activeMedicines = prescriptions.reduce((total, prescription) => {
    if (prescription.status === "Active") {
      return total + (prescription.medicines?.length || 0);
    }

    return total;
  }, 0);

  const latestPrescription =
    prescriptions.length > 0
      ? prescriptions
          .slice()
          .sort(
            (a, b) =>
              new Date(b.prescriptionDate) -
              new Date(a.prescriptionDate)
          )[0]
      : null;

  const latestDate = latestPrescription
    ? formatDate(latestPrescription.prescriptionDate)
    : "-";

  return (
    <div className="prescriptions-page">

      {/* Page Header */}

      <section className="prescriptions-header">

        <div>

          <span className="prescriptions-label">
            PATIENT PRESCRIPTIONS
          </span>

          <h1>Prescriptions</h1>

          <p>
            View your prescribed medicines, dosage instructions and
            prescription history in one place.
          </p>

        </div>

      </section>


      {/* Main Content */}

      <section className="prescriptions-content">

        {/* Loading */}

        {loading && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Loading prescriptions...
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div
            style={{
              padding: "20px",
              marginBottom: "20px",
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}


        {!loading && !error && (
          <>

            {/* Summary */}

            <div className="prescription-summary">

              <div className="prescription-summary-card">

                <div className="prescription-summary-icon">
                  💊
                </div>

                <div>
                  <span>Total Prescriptions</span>
                  <strong>{totalPrescriptions}</strong>
                </div>

              </div>


              <div className="prescription-summary-card">

                <div className="prescription-summary-icon">
                  💉
                </div>

                <div>
                  <span>Active Medicines</span>
                  <strong>{activeMedicines}</strong>
                </div>

              </div>


              <div className="prescription-summary-card">

                <div className="prescription-summary-icon">
                  📅
                </div>

                <div>
                  <span>Latest Prescription</span>
                  <strong>{latestDate}</strong>
                </div>

              </div>

            </div>


            {/* No Prescriptions */}

            {prescriptions.length === 0 && (

              <section className="prescription-section">

                <div className="prescription-card">

                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#64748b",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "40px",
                        marginBottom: "10px",
                      }}
                    >
                      💊
                    </div>

                    <h3>No prescriptions found</h3>

                    <p>
                      Your prescribed medicines will appear here
                      once your doctor creates a prescription.
                    </p>

                  </div>

                </div>

              </section>

            )}


            {/* Current Prescription */}

            {latestPrescription && (

              <section className="prescription-section">

                <div className="prescription-section-heading">

                  <div>

                    <span>CURRENT PRESCRIPTION</span>

                    <h2>Latest Prescription</h2>

                  </div>

                  <span className="prescription-status">
                    {latestPrescription.status}
                  </span>

                </div>


                <div className="prescription-card">

                  {/* Prescription Header */}

                  <div className="prescription-card-header">

                    <div className="prescription-doctor">

                      <div className="prescription-doctor-avatar">
                        👨‍⚕️
                      </div>

                      <div>

                        <h3>
                          {latestPrescription.doctorName}
                        </h3>

                        <p>
                          {latestPrescription.department}
                        </p>

                      </div>

                    </div>


                    <div className="prescription-date">

                      <span>Prescribed On</span>

                      <strong>
                        {formatDate(
                          latestPrescription.prescriptionDate
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* Diagnosis */}

                  <div className="prescription-diagnosis">

                    <span>Diagnosis</span>

                    <strong>
                      {latestPrescription.diagnosis}
                    </strong>

                  </div>


                  {/* Medicines */}

                  <div className="medicine-section">

                    <div className="medicine-section-heading">

                      <h3>Medicines</h3>

                      <span>
                        {latestPrescription.medicines?.length || 0}{" "}
                        Medicines
                      </span>

                    </div>


                    <div className="medicine-list">

                      {latestPrescription.medicines?.map(
                        (medicine, index) => (

                          <div
                            className="medicine-row"
                            key={`${medicine.medicineName}-${index}`}
                          >

                            <div className="medicine-icon">
                              💊
                            </div>


                            <div className="medicine-info">

                              <strong>
                                {medicine.medicineName}
                              </strong>

                              <span>
                                {medicine.instructions ||
                                  "As prescribed by doctor"}
                              </span>

                            </div>


                            <div className="medicine-instruction">

                              <span>Dosage</span>

                              <strong>
                                {medicine.dosage}
                              </strong>

                            </div>


                            <div className="medicine-instruction">

                              <span>Frequency</span>

                              <strong>
                                {medicine.frequency}
                              </strong>

                            </div>


                            <div className="medicine-instruction">

                              <span>Duration</span>

                              <strong>
                                {medicine.duration}
                              </strong>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  {/* Notes */}

                  <div className="prescription-notes">

                    <span>Doctor's Instructions</span>

                    <p>
                      {latestPrescription.additionalInstructions ||
                        "No additional instructions provided."}
                    </p>

                  </div>


                  {/* Actions */}

                  <div className="prescription-actions">

                    <button
                      type="button"
                      className="prescription-view-btn"
                      onClick={() =>
                        openPrescription(latestPrescription)
                      }
                    >
                      View Prescription
                    </button>


                    <button
                      type="button"
                      className="prescription-download-btn"
                      onClick={() =>
                        downloadPrescription(latestPrescription)
                      }
                    >
                      ↓ Download PDF
                    </button>

                  </div>

                </div>

              </section>

            )}


            {/* Prescription History */}

            {prescriptions.length > 0 && (

              <section className="prescription-section prescription-history">

                <div className="prescription-section-heading">

                  <div>

                    <span>PRESCRIPTION HISTORY</span>

                    <h2>Previous Prescriptions</h2>

                  </div>

                  <span className="prescription-count">
                    {prescriptions.length}{" "}
                    {prescriptions.length === 1
                      ? "Prescription"
                      : "Prescriptions"}
                  </span>

                </div>


                <div className="prescription-history-list">

                  {prescriptions
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.prescriptionDate) -
                        new Date(a.prescriptionDate)
                    )
                    .map((prescription) => (

                      <div
                        className="prescription-history-row"
                        key={prescription.prescriptionId}
                      >

                        <div className="history-date">

                          <strong>
                            {new Date(
                              prescription.prescriptionDate
                            ).getDate()}
                          </strong>

                          <span>
                            {new Date(
                              prescription.prescriptionDate
                            ).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>

                        </div>


                        <div className="history-doctor">

                          <div className="small-prescription-avatar">
                            👨‍⚕️
                          </div>

                          <div>

                            <strong>
                              {prescription.doctorName}
                            </strong>

                            <span>
                              {prescription.department}
                            </span>

                          </div>

                        </div>


                        <div className="history-diagnosis">

                          <span>Diagnosis</span>

                          <strong>
                            {prescription.diagnosis}
                          </strong>

                        </div>


                        <span
                          className={
                            prescription.status === "Active"
                              ? "prescription-completed"
                              : "prescription-status"
                          }
                        >
                          {prescription.status}
                        </span>


                        <button
                          type="button"
                          className="history-view-btn"
                          onClick={() =>
                            openPrescription(prescription)
                          }
                        >
                          View
                        </button>

                      </div>

                    ))}

                </div>

              </section>

            )}

          </>
        )}

      </section>


      {/* PRESCRIPTION VIEW MODAL */}

      {selectedPrescription && (

        <div
          className="prescription-modal-overlay"
          onClick={(event) => {

            if (event.target === event.currentTarget) {
              closePrescription();
            }

          }}
        >

          <div className="prescription-modal">

            <button
              type="button"
              className="prescription-modal-close"
              onClick={closePrescription}
              aria-label="Close prescription"
            >
              ×
            </button>


            <div className="prescription-modal-header">

              <span className="prescriptions-label">
                MEDICARE HOSPITAL
              </span>

              <h2>Prescription Details</h2>

              <p>
                Patient prescription record
              </p>

            </div>


            <div className="prescription-modal-doctor">

              <div className="prescription-doctor-avatar">
                👨‍⚕️
              </div>

              <div>

                <h3>
                  {selectedPrescription.doctorName}
                </h3>

                <p>
                  {selectedPrescription.department}
                </p>

              </div>

            </div>


            <div className="prescription-modal-info">

              <div>

                <span>Prescribed On</span>

                <strong>
                  {formatDate(
                    selectedPrescription.prescriptionDate
                  )}
                </strong>

              </div>


              <div>

                <span>Diagnosis</span>

                <strong>
                  {selectedPrescription.diagnosis}
                </strong>

              </div>


              <div>

                <span>Prescription ID</span>

                <strong>
                  {selectedPrescription.prescriptionId}
                </strong>

              </div>


              <div>

                <span>Status</span>

                <strong>
                  {selectedPrescription.status}
                </strong>

              </div>

            </div>


            <div className="prescription-modal-medicines">

              <div className="medicine-section-heading">

                <h3>Medicines</h3>

                <span>
                  {selectedPrescription.medicines?.length || 0}{" "}
                  Medicines
                </span>

              </div>


              {selectedPrescription.medicines?.map(
                (medicine, index) => (

                  <div
                    className="prescription-modal-medicine"
                    key={`${medicine.medicineName}-${index}`}
                  >

                    <div className="medicine-icon">
                      💊
                    </div>


                    <div className="medicine-info">

                      <strong>
                        {medicine.medicineName}
                      </strong>

                      <span>
                        {medicine.instructions ||
                          "As prescribed by doctor"}
                      </span>

                    </div>


                    <div className="medicine-instruction">

                      <span>Dosage</span>

                      <strong>
                        {medicine.dosage}
                      </strong>

                    </div>


                    <div className="medicine-instruction">

                      <span>Frequency</span>

                      <strong>
                        {medicine.frequency}
                      </strong>

                    </div>


                    <div className="medicine-instruction">

                      <span>Duration</span>

                      <strong>
                        {medicine.duration}
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>


            <div className="prescription-modal-instructions">

              <span>Doctor's Instructions</span>

              <p>
                {selectedPrescription.additionalInstructions ||
                  "No additional instructions provided."}
              </p>

            </div>


            <div className="prescription-modal-actions">

              <button
                type="button"
                className="prescription-download-btn"
                onClick={() =>
                  downloadPrescription(selectedPrescription)
                }
              >
                ↓ Download PDF
              </button>


              <button
                type="button"
                className="prescription-view-btn"
                onClick={closePrescription}
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

export default Prescriptions;