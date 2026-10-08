import { useEffect, useState } from "react";
import "./Doctors.css";
import { Link } from "react-router-dom";

function Doctors() {

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH DOCTORS FROM BACKEND */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();

        /*
          Only show doctors who are:
          - Active
          - Enabled
        */

        const activeDoctors = data.filter(
          (doctor) =>
            doctor.status === "Active" &&
            doctor.accountAccess === "Enabled"
        );

        setDoctors(activeDoctors);

      } catch (error) {

        console.error(
          "Fetch doctors error:",
          error
        );

        setError(
          "Unable to load doctors. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);


  /* SEARCH + DEPARTMENT FILTER */

  const filteredDoctors = doctors.filter((doctor) => {

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      doctor.name.toLowerCase().includes(search) ||
      doctor.specialization.toLowerCase().includes(search) ||
      doctor.department.toLowerCase().includes(search);

    const matchesDepartment =
      department === "All Departments" ||
      doctor.department === department;

    return matchesSearch && matchesDepartment;
  });


  /* CREATE URL SLUG */

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/^dr\.\s*/, "")
      .replace(/\s+/g, "-");
  };


  return (
    <div className="doctors-page">

      {/* Page Header */}

      <section className="doctors-hero">

        <div>

          <span className="page-label">
            OUR MEDICAL SPECIALISTS
          </span>

          <h1>
            Find the right doctor for your care.
          </h1>

          <p>
            Explore our experienced specialists and find a doctor
            who matches your healthcare needs.
          </p>

        </div>

      </section>


      {/* Search & Filter */}

      <section className="doctor-search-section">

        <div className="search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search doctor or specialty"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>


        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
        >

          <option value="All Departments">
            All Departments
          </option>

          <option value="Cardiology">
            Cardiology
          </option>

          <option value="Neurology">
            Neurology
          </option>

          <option value="Orthopedics">
            Orthopedics
          </option>

          <option value="General Medicine">
            General Medicine
          </option>

        </select>

      </section>


      {/* Doctors */}

      <section className="doctor-list-section">

        <div className="doctor-list-heading">

          <div>

            <span>
              OUR SPECIALISTS
            </span>

            <h2>
              Meet Our Doctors
            </h2>

          </div>

          <p>
            {loading
              ? "Loading doctors..."
              : `${filteredDoctors.length} doctors available`}
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <p className="doctor-error">
            {error}
          </p>
        )}


        {/* LOADING */}

        {loading && (
          <p className="doctor-loading">
            Loading doctors...
          </p>
        )}


        {/* NO DOCTORS */}

        {!loading &&
          !error &&
          filteredDoctors.length === 0 && (
            <div className="no-doctors">
              <h3>
                No doctors found
              </h3>

              <p>
                Try searching with a different doctor name,
                specialty, or department.
              </p>
            </div>
          )}


        {/* DOCTOR GRID */}

        {!loading &&
          !error &&
          filteredDoctors.length > 0 && (

            <div className="professional-doctor-grid">

              {filteredDoctors.map((doctor) => (

                <div
                  className="professional-doctor-card"
                  key={doctor.doctorId}
                >

                  {/* TOP */}

                  <div className="doctor-top">

                    <div className="professional-doctor-avatar">
                      {doctor.gender === "Female"
                        ? "👩‍⚕️"
                        : "👨‍⚕️"}
                    </div>

                    <span className="available">
                      ● Available
                    </span>

                  </div>


                  {/* MAIN INFO */}

                  <div className="doctor-main-info">

                    <h3>
                      {doctor.name}
                    </h3>

                    <p className="specialization">
                      {doctor.specialization}
                    </p>

                    <div className="rating">
                      ★ <strong>4.8</strong>
                      <span>
                        (New profile)
                      </span>
                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="doctor-details">

                    <div>

                      <span>
                        Experience
                      </span>

                      <strong>
                        {doctor.experience}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Consultation
                      </span>

                      <strong>
                        ₹{doctor.consultationFee}
                      </strong>

                    </div>

                  </div>


                  {/* VIEW PROFILE */}

                  <Link
                    to={`/doctors/${createSlug(doctor.name)}`}
                    className="view-profile-btn"
                    state={{
                      doctorId: doctor.doctorId
                    }}
                  >
                    View Profile →
                  </Link>

                </div>

              ))}

            </div>

          )}

      </section>

    </div>
  );
}

export default Doctors;