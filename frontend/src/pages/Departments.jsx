import "./Departments.css";
import { Link } from "react-router-dom";

function Departments() {
  return (
    <div className="departments-page">

      {/* Page Header */}
      <section className="departments-hero">
        <div>
          <span className="page-label">OUR MEDICAL SERVICES</span>

          <h1>Medical Departments</h1>

          <p>
            Explore our specialized departments and find the right
            medical care for your health needs.
          </p>
        </div>
      </section>


      {/* Departments List */}
      <section className="departments-list-section">

        <div className="section-heading">
          <span>HEALTHCARE SPECIALITIES</span>

          <h2>Our Departments</h2>

          <p>
            Our experienced medical professionals provide specialized
            care across multiple departments.
          </p>
        </div>


        <div className="professional-department-grid">

          {/* Cardiology */}
          <div className="professional-department-card">

            <div className="professional-department-icon">
              ❤️
            </div>

            <div className="department-content">

              <span className="department-number">
                01
              </span>

              <h3>Cardiology</h3>

              <p>
                Specialized care for the heart and cardiovascular
                system, including diagnosis and treatment of heart
                conditions.
              </p>

              <div className="department-info">
                <span>👨‍⚕️ 12 Doctors</span>
                <span>24/7 Care</span>
              </div>

              <Link to="/doctors" className="department-view-btn">
                 View Doctors →
              </Link>

            </div>

          </div>


          {/* Neurology */}
          <div className="professional-department-card">

            <div className="professional-department-icon">
              🧠
            </div>

            <div className="department-content">

              <span className="department-number">
                02
              </span>

              <h3>Neurology</h3>

              <p>
                Comprehensive diagnosis and treatment for conditions
                affecting the brain, spinal cord and nervous system.
              </p>

              <div className="department-info">
                <span>👨‍⚕️ 8 Doctors</span>
                <span>Specialist Care</span>
              </div>

             <Link to="/doctors" className="department-view-btn">
                View Doctors →
             </Link>

            </div>

          </div>


          {/* Orthopedics */}
          <div className="professional-department-card">

            <div className="professional-department-icon">
              🦴
            </div>

            <div className="department-content">

              <span className="department-number">
                03
              </span>

              <h3>Orthopedics</h3>

              <p>
                Treatment and rehabilitation for bones, joints,
                muscles, ligaments and other parts of the
                musculoskeletal system.
              </p>

              <div className="department-info">
                <span>👨‍⚕️ 10 Doctors</span>
                <span>Advanced Care</span>
              </div>

              <Link to="/doctors" className="department-view-btn">
                View Doctors →
              </Link>

            </div>

          </div>


          {/* General Medicine */}
          <div className="professional-department-card">

            <div className="professional-department-icon">
              🩺
            </div>

            <div className="department-content">

              <span className="department-number">
                04
              </span>

              <h3>General Medicine</h3>

              <p>
                Primary healthcare, diagnosis and treatment for
                common medical conditions and general health concerns.
              </p>

              <div className="department-info">
                <span>👨‍⚕️ 15 Doctors</span>
                <span>24/7 Support</span>
              </div>

              <Link to="/doctors" className="department-view-btn">
                 View Doctors →
              </Link>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Departments;