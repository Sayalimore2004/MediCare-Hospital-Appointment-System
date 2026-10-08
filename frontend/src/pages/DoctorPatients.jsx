import "./DoctorPatients.css";
import { useEffect, useState } from "react";

function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctorPatients();
  }, []);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "—";
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return "—";
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getInitials = (name) => {
    if (!name) {
      return "PT";
    }

    const parts = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const fetchDoctorPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("doctorToken");

      const storedDoctorData =
        localStorage.getItem("doctorData");

      if (!token || !storedDoctorData) {
        window.location.href = "/login";
        return;
      }

      const doctor =
        JSON.parse(storedDoctorData);

      if (!doctor?.doctorId) {
        setError(
          "Doctor information not found."
        );
        return;
      }

      // Get appointments belonging to this doctor
      const appointmentsResponse =
        await fetch(
          `http://localhost:5000/api/appointments/doctor/${doctor.doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const appointmentsData =
        await appointmentsResponse.json();

      if (!appointmentsResponse.ok) {
        setError(
          appointmentsData.message ||
            "Failed to fetch doctor appointments."
        );
        return;
      }

      const appointments = Array.isArray(
        appointmentsData
      )
        ? appointmentsData
        : appointmentsData.appointments || [];

      // Get all patients
      const patientsResponse =
        await fetch(
          "http://localhost:5000/api/patients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const patientsData =
        await patientsResponse.json();

      if (!patientsResponse.ok) {
        setError(
          patientsData.message ||
            "Failed to fetch patients."
        );
        return;
      }

      const allPatients = Array.isArray(
        patientsData
      )
        ? patientsData
        : patientsData.patients || [];

      /*
       * Only include patients who actually
       * have appointments with this doctor.
       */
      const doctorPatientIds =
        [
          ...new Set(
            appointments
              .filter(
                (appointment) =>
                  appointment.status !==
                    "Cancelled" &&
                  appointment.status !==
                    "Rejected"
              )
              .map(
                (appointment) =>
                  appointment.patientId
              )
          ),
        ];

      const doctorPatients =
        doctorPatientIds.map((patientId) => {
          const patient =
            allPatients.find(
              (item) =>
                item.patientId === patientId
            );

          const patientAppointments =
            appointments
              .filter(
                (appointment) =>
                  appointment.patientId ===
                  patientId
              )
              .sort((a, b) => {
                const dateA = new Date(
                  `${a.appointmentDate} ${a.appointmentTime}`
                );

                const dateB = new Date(
                  `${b.appointmentDate} ${b.appointmentTime}`
                );

                return (
                  dateB.getTime() -
                  dateA.getTime()
                );
              });

          const latestAppointment =
            patientAppointments[0];

          const followUpAppointment =
            patientAppointments.some(
              (appointment) =>
                appointment.reason
                  ?.toLowerCase()
                  .includes("follow")
            );

          const firstAppointment =
            [...patientAppointments].sort(
              (a, b) =>
                new Date(
                  a.createdAt
                ).getTime() -
                new Date(
                  b.createdAt
                ).getTime()
            )[0];

          const patientName =
            patient?.name ||
            latestAppointment?.patientName ||
            "Unknown Patient";

          const gender =
            patient?.gender || "—";

          const dateOfBirth =
            patient?.dateOfBirth ||
            patient?.dob ||
            patient?.birthDate;

          const age =
            calculateAge(dateOfBirth);

          const lastVisit =
            latestAppointment
              ? formatDate(
                  latestAppointment.appointmentDate
                )
              : "—";

          const consultation =
            latestAppointment?.reason ||
            "General Consultation";

          const status =
            followUpAppointment
              ? "Follow-up"
              : patient?.status ||
                "Active";

          return {
            id: patientId,
            patientId,
            initials:
              getInitials(patientName),
            name: patientName,
            gender,
            age,
            lastVisit,
            consultation,
            status,
            appointments:
              patientAppointments,
            firstAppointmentDate:
              firstAppointment?.createdAt ||
              null,
          };
        });

      setPatients(doctorPatients);
    } catch (error) {
      console.error(
        "Fetch doctor patients error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the MediCare backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients =
    patients.filter((patient) =>
      patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const newThisMonth =
    patients.filter((patient) => {
      if (!patient.firstAppointmentDate) {
        return false;
      }

      const date = new Date(
        patient.firstAppointmentDate
      );

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }).length;

  const followUpCount =
    patients.filter(
      (patient) =>
        patient.status === "Follow-up"
    ).length;

  const activePatients =
    patients.filter(
      (patient) =>
        patient.status === "Active"
    ).length;

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  if (loading) {
    return (
      <div className="doctor-patients-page">
        <header className="doctor-patients-header">
          <div>
            <span>DOCTOR PATIENTS</span>

            <h1>My Patients</h1>

            <p>
              View and manage the patients assigned
              to your medical practice.
            </p>
          </div>
        </header>

        <div className="doctor-patient-no-results">
          Loading patients...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-patients-page">
        <header className="doctor-patients-header">
          <div>
            <span>DOCTOR PATIENTS</span>

            <h1>My Patients</h1>

            <p>
              View and manage the patients assigned
              to your medical practice.
            </p>
          </div>
        </header>

        <div className="doctor-patient-no-results">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-patients-page">

      {/* Header */}

      <header className="doctor-patients-header">
        <div>
          <span>DOCTOR PATIENTS</span>

          <h1>My Patients</h1>

          <p>
            View and manage the patients assigned
            to your medical practice.
          </p>
        </div>
      </header>


      {/* Statistics */}

      <section className="doctor-patient-stats">

        <div className="doctor-patient-stat">
          <span>Total Patients</span>
          <strong>
            {patients.length}
          </strong>
        </div>

        <div className="doctor-patient-stat">
          <span>New This Month</span>
          <strong>
            {newThisMonth}
          </strong>
        </div>

        <div className="doctor-patient-stat">
          <span>Follow-ups</span>
          <strong>
            {followUpCount}
          </strong>
        </div>

        <div className="doctor-patient-stat">
          <span>Active Patients</span>
          <strong>
            {activePatients}
          </strong>
        </div>

      </section>


      {/* Patient List */}

      <section className="doctor-patients-card">

        <div className="doctor-patients-card-heading">

          <div>
            <span>PATIENT DIRECTORY</span>
            <h2>Patient List</h2>
          </div>

          {/* Search */}

          <div className="doctor-patient-search">

            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>


        {/* Patient Table */}

        <div className="doctor-patient-table">

          <div className="doctor-patient-table-header">
            <span>Patient</span>
            <span>Age</span>
            <span>Last Visit</span>
            <span>Consultation</span>
            <span>Status</span>
            <span>Action</span>
          </div>


          {filteredPatients.length > 0 ? (

            filteredPatients.map(
              (patient) => (

                <div
                  className="doctor-patient-table-row"
                  key={patient.patientId}
                >

                  {/* Patient */}

                  <div className="doctor-patient-info-cell">

                    <div className="doctor-patient-avatar">
                      {patient.initials}
                    </div>

                    <div>
                      <strong>
                        {patient.name}
                      </strong>

                      <span>
                        {patient.gender}
                      </span>
                    </div>

                  </div>


                  {/* Age */}

                  <span>
                    {patient.age}
                  </span>


                  {/* Last Visit */}

                  <span>
                    {patient.lastVisit}
                  </span>


                  {/* Consultation */}

                  <span>
                    {patient.consultation}
                  </span>


                  {/* Status */}

                  <span
                    className={
                      patient.status ===
                      "Active"
                        ? "doctor-patient-active"
                        : "doctor-patient-followup"
                    }
                  >
                    {patient.status}
                  </span>


                  {/* View Details */}

                  <button
                    type="button"
                    onClick={() =>
                      handleViewDetails(
                        patient
                      )
                    }
                  >
                    View Details
                  </button>

                </div>

              )

            )

          ) : (

            <div className="doctor-patient-no-results">
              No patients found.
            </div>

          )}

        </div>

      </section>


      {/* Patient Details Modal */}

      {selectedPatient !== null && (

        <div
          className="doctor-patient-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="doctor-patient-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="doctor-patient-modal-header">

              <div>
                <span>PATIENT DETAILS</span>

                <h2>
                  {selectedPatient.name}
                </h2>
              </div>

              <button
                type="button"
                className="doctor-patient-modal-close"
                onClick={handleCloseModal}
                aria-label="Close patient details"
              >
                ×
              </button>

            </div>


            {/* Patient Profile */}

            <div className="doctor-patient-modal-profile">

              <div className="doctor-patient-modal-avatar">
                {selectedPatient.initials}
              </div>

              <div>
                <strong>
                  {selectedPatient.name}
                </strong>

                <span>
                  {selectedPatient.gender} · Age{" "}
                  {selectedPatient.age}
                </span>
              </div>

            </div>


            {/* Patient Details */}

            <div className="doctor-patient-modal-details">

              <div>
                <span>AGE</span>

                <strong>
                  {selectedPatient.age ===
                  "—"
                    ? "Not available"
                    : `${selectedPatient.age} years`}
                </strong>
              </div>

              <div>
                <span>GENDER</span>

                <strong>
                  {selectedPatient.gender}
                </strong>
              </div>

              <div>
                <span>LAST VISIT</span>

                <strong>
                  {selectedPatient.lastVisit}
                </strong>
              </div>

              <div>
                <span>CONSULTATION</span>

                <strong>
                  {selectedPatient.consultation}
                </strong>
              </div>

              <div>
                <span>STATUS</span>

                <strong
                  className={
                    selectedPatient.status ===
                    "Active"
                      ? "doctor-patient-modal-active"
                      : "doctor-patient-modal-followup"
                  }
                >
                  {selectedPatient.status}
                </strong>
              </div>

            </div>


            {/* Close Button */}

            <div className="doctor-patient-modal-actions">

              <button
                type="button"
                onClick={handleCloseModal}
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

export default DoctorPatients;