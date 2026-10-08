import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookAppointment.css";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* GET TODAY'S DATE */

  const today = new Date();
  const minimumDate =
    today.toISOString().split("T")[0];


  /* LOAD PATIENT */

  useEffect(() => {
    const storedPatient =
      localStorage.getItem("patientData");

    if (storedPatient) {
      setPatientData(
        JSON.parse(storedPatient)
      );
    }
  }, []);


  /* LOAD DOCTOR FROM BACKEND */

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch doctors"
          );
        }

        const doctors = await response.json();

        const foundDoctor = doctors.find(
          (doctor) =>
            doctor.doctorId === doctorId
        );

        if (!foundDoctor) {
          setError("Doctor not found.");
          return;
        }

        if (
          foundDoctor.status !== "Active" ||
          foundDoctor.accountAccess !== "Enabled"
        ) {
          setError(
            "This doctor is currently unavailable."
          );
          return;
        }

        setDoctor(foundDoctor);

      } catch (error) {

        console.error(
          "Fetch doctor error:",
          error
        );

        setError(
          "Unable to load doctor information."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);


  /* BOOK APPOINTMENT */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    /* CHECK LOGIN */

    if (!patientData) {
      setError(
        "Please login as a patient before booking an appointment."
      );

      return;
    }


    /* VALIDATION */

    if (
      !appointmentDate ||
      !appointmentTime
    ) {
      setError(
        "Please select appointment date and time."
      );

      return;
    }


    try {

      setBooking(true);


      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patientId:
              patientData.patientId,

            patientName:
              patientData.name,

            doctorId:
              doctor.doctorId,

            appointmentDate:
              appointmentDate,

            appointmentTime:
              appointmentTime,

            reason:
              reason,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to book appointment."
        );
      }


      setSuccess(
        `Appointment booked successfully! Appointment ID: ${data.appointment.appointmentId}`
      );


      /* CLEAR FORM */

      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");


    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      setError(
        error.message ||
          "Failed to book appointment."
      );

    } finally {

      setBooking(false);

    }
  };


  /* LOADING */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7fbfc",
          color: "#173f3e",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading doctor information...
      </div>
    );
  }


  /* ERROR */

  if (error && !doctor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7fbfc",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >

        <h1
          style={{
            color: "#173f3e",
          }}
        >
          Doctor Not Found
        </h1>

        <p
          style={{
            color: "#687978",
          }}
        >
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/doctors")
          }
          style={{
            background: "#168b87",
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back to Doctors
        </button>

      </div>
    );
  }


  return (
    <div className="book-appointment-page">

      {/* PAGE HEADER */}

      <section className="book-appointment-header">

        <div>

          <span className="page-label">
            APPOINTMENT
          </span>

          <h1>
            Book an Appointment
          </h1>

          <p>
            Choose a convenient date and time
            for your consultation.
          </p>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="book-appointment-content">

        {/* DOCTOR INFORMATION */}

        <div className="appointment-doctor-card">

          <div className="appointment-doctor-avatar">
            {doctor.gender === "Female"
              ? "👩‍⚕️"
              : "👨‍⚕️"}
          </div>


          <div>

            <span className="doctor-status">
              ● Available
            </span>

            <h2>
              {doctor.name}
            </h2>

            <p className="doctor-specialization">
              {doctor.specialization}
            </p>

            <p className="doctor-department">
              {doctor.department}
            </p>

          </div>

        </div>


        {/* APPOINTMENT FORM */}

        <div className="appointment-form-card">

          <h2>
            Appointment Details
          </h2>


          {error && (
            <div className="appointment-error">
              {error}
            </div>
          )}


          {success && (
            <div className="appointment-success">
              {success}
            </div>
          )}


          {!patientData && (
            <div className="appointment-login-warning">
              Please login as a patient before
              booking an appointment.
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* DATE */}

            <div className="form-group">

              <label>
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                min={minimumDate}
                onChange={(e) =>
                  setAppointmentDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* TIME */}

            <div className="form-group">

              <label>
                Appointment Time
              </label>

              <select
                value={appointmentTime}
                onChange={(e) =>
                  setAppointmentTime(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select a time
                </option>

                <option value="09:00 AM">
                  09:00 AM
                </option>

                <option value="09:30 AM">
                  09:30 AM
                </option>

                <option value="10:00 AM">
                  10:00 AM
                </option>

                <option value="10:30 AM">
                  10:30 AM
                </option>

                <option value="11:00 AM">
                  11:00 AM
                </option>

                <option value="11:30 AM">
                  11:30 AM
                </option>

                <option value="12:00 PM">
                  12:00 PM
                </option>

                <option value="12:30 PM">
                  12:30 PM
                </option>

                <option value="02:00 PM">
                  02:00 PM
                </option>

                <option value="02:30 PM">
                  02:30 PM
                </option>

                <option value="03:00 PM">
                  03:00 PM
                </option>

                <option value="03:30 PM">
                  03:30 PM
                </option>

                <option value="04:00 PM">
                  04:00 PM
                </option>

                <option value="04:30 PM">
                  04:30 PM
                </option>

                <option value="05:00 PM">
                  05:00 PM
                </option>

              </select>

            </div>


            {/* REASON */}

            <div className="form-group">

              <label>
                Reason for Visit
              </label>

              <textarea
                placeholder="Briefly describe the reason for your visit"
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                rows="4"
              />

            </div>


            {/* FEE */}

            <div className="appointment-fee">

              <span>
                Consultation Fee
              </span>

              <strong>
                ₹{doctor.consultationFee}
              </strong>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="book-appointment-submit"
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : "Confirm Appointment →"}
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}

export default BookAppointment;