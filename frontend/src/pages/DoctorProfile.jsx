import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function DoctorProfile() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH REAL DOCTOR FROM BACKEND */

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const doctors = await response.json();

        /*
          Convert URL slug into doctor name.

          Example:
          test-doctor → Dr. Test Doctor
          priya-joshi → Dr. Priya Joshi
        */

        const doctorName = doctorId
          .split("-")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() +
              word.slice(1)
          )
          .join(" ");

        const foundDoctor = doctors.find(
          (doctor) =>
            doctor.name
              .replace(/^Dr\.\s*/i, "")
              .toLowerCase() ===
            doctorName.toLowerCase()
        );

        if (!foundDoctor) {
          setError("Doctor profile not found.");
          return;
        }

        /* Only active + enabled doctors */

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
          "Unable to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);


  /* LOADING */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7fbfc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#173f3e",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading doctor profile...
      </div>
    );
  }


  /* ERROR */

  if (error || !doctor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7fbfc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#173f3e" }}>
          Doctor Not Found
        </h1>

        <p style={{ color: "#687978" }}>
          {error ||
            "The doctor profile you are looking for does not exist."}
        </p>

        <Link
          to="/doctors"
          style={{
            background: "#168b87",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Doctors
        </Link>
      </div>
    );
  }


  /* DOCTOR AVATAR */

  const avatar =
    doctor.gender === "Female"
      ? "👩‍⚕️"
      : "👨‍⚕️";


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fbfc",
        color: "#173f3e",
      }}
    >

      {/* HEADER */}

      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "35px",
          padding: "70px 8%",
          background:
            "linear-gradient(135deg, #eaf8f7, #f7fbfc)",
          borderBottom: "1px solid #e1eeee",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            width: "140px",
            height: "140px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            border: "1px solid #dceeed",
            borderRadius: "24px",
            fontSize: "62px",
            boxShadow:
              "0 10px 30px rgba(19, 65, 64, 0.08)",
          }}
        >
          {avatar}
        </div>


        <div>

          <span
            style={{
              display: "inline-block",
              padding: "6px 11px",
              marginBottom: "14px",
              background: "#e8f7f1",
              borderRadius: "20px",
              color: "#168b87",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            ● Available
          </span>


          <h1
            style={{
              margin: "0 0 8px",
              color: "#123b3a",
              fontSize: "42px",
              lineHeight: "1.2",
            }}
          >
            {doctor.name}
          </h1>


          <p
            style={{
              margin: "0 0 16px",
              color: "#168b87",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {doctor.specialization}
          </p>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              paddingTop: "12px",
              borderTop: "1px solid #dceeed",
            }}
          >

            <span
              style={{
                color: "#f2b84b",
                fontSize: "18px",
              }}
            >
              ★
            </span>

            <strong
              style={{
                color: "#173f3e",
              }}
            >
              4.8
            </strong>

            <span
              style={{
                color: "#687978",
                fontSize: "14px",
              }}
            >
              New profile
            </span>

          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "30px",
          padding: "60px 8%",
          boxSizing: "border-box",
        }}
      >

        {/* LEFT */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >

          {/* ABOUT */}

          <div
            style={{
              padding: "30px",
              background: "#ffffff",
              border: "1px solid #e3eeee",
              borderRadius: "18px",
              boxShadow:
                "0 10px 30px rgba(19, 65, 64, 0.05)",
            }}
          >

            <h2
              style={{
                margin: "0 0 15px",
                color: "#173f3e",
                fontSize: "24px",
              }}
            >
              About the Doctor
            </h2>

            <p
              style={{
                margin: 0,
                color: "#687978",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              Dr. {doctor.name.replace(/^Dr\.\s*/i, "")} is
              an experienced {doctor.specialization.toLowerCase()}
              dedicated to providing personalized care and
              comprehensive treatment for patients. The doctor
              focuses on accurate diagnosis, effective treatment,
              and long-term patient care.
            </p>

          </div>


          {/* PROFESSIONAL INFORMATION */}

          <div
            style={{
              padding: "30px",
              background: "#ffffff",
              border: "1px solid #e3eeee",
              borderRadius: "18px",
              boxShadow:
                "0 10px 30px rgba(19, 65, 64, 0.05)",
            }}
          >

            <h2
              style={{
                margin: "0 0 15px",
                color: "#173f3e",
                fontSize: "24px",
              }}
            >
              Professional Information
            </h2>


            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >

              <InfoBox
                label="Experience"
                value={doctor.experience}
              />

              <InfoBox
                label="Qualification"
                value={doctor.qualification}
              />

              <InfoBox
                label="Specialization"
                value={doctor.specialization}
              />

              <InfoBox
                label="Department"
                value={doctor.department}
              />

              <InfoBox
                label="Consultation"
                value={`₹${doctor.consultationFee}`}
              />

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <div
          style={{
            alignSelf: "start",
            padding: "32px",
            background: "#ffffff",
            border: "1px solid #dceeed",
            borderRadius: "18px",
            boxShadow:
              "0 12px 35px rgba(19, 65, 64, 0.08)",
          }}
        >

          <span
            style={{
              color: "#168b87",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1.5px",
            }}
          >
            CONSULTATION
          </span>


          <h2
            style={{
              margin: "12px 0",
              color: "#173f3e",
              fontSize: "26px",
            }}
          >
            Book an Appointment
          </h2>


          <p
            style={{
              margin: "0 0 25px",
              color: "#687978",
              lineHeight: "1.7",
              fontSize: "14px",
            }}
          >
            Choose a convenient date and time for your
            consultation.
          </p>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              marginBottom: "20px",
              borderTop: "1px solid #e6eeee",
              borderBottom: "1px solid #e6eeee",
            }}
          >

            <span
              style={{
                color: "#687978",
                fontSize: "14px",
              }}
            >
              Consultation Fee
            </span>

            <strong
              style={{
                color: "#173f3e",
                fontSize: "22px",
              }}
            >
              ₹{doctor.consultationFee}
            </strong>

          </div>


          {/* BOOK APPOINTMENT */}

          <Link
            to={`/book-appointment/${doctor.doctorId}`}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "10px",
              background: "#168b87",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          >
            Book Appointment →
          </Link>

        </div>

      </section>

    </div>
  );
}


function InfoBox({ label, value }) {
  return (
    <div
      style={{
        padding: "18px",
        background: "#f7fbfc",
        borderRadius: "12px",
      }}
    >

      <span
        style={{
          display: "block",
          marginBottom: "7px",
          color: "#849493",
          fontSize: "12px",
        }}
      >
        {label}
      </span>


      <strong
        style={{
          color: "#173f3e",
          fontSize: "14px",
        }}
      >
        {value}
      </strong>

    </div>
  );
}


export default DoctorProfile;