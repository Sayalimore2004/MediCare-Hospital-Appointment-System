import "./Services.css";

function Services() {
  return (
    <div className="services-page">

      <section className="services-hero">
        <div>
          <span className="services-label">OUR HEALTHCARE SERVICES</span>

          <h1>Comprehensive care for every stage of your health.</h1>

          <p>
            Access quality healthcare services through a connected platform
            designed to support patients, doctors and hospital staff.
          </p>
        </div>
      </section>

      <section className="services-section">

        <div className="services-heading">
          <span>WHAT WE PROVIDE</span>
          <h2>Healthcare Services</h2>
          <p>
            From consultations to medical records, manage your healthcare
            journey through one secure platform.
          </p>
        </div>

        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon">🩺</div>
            <span className="service-number">01</span>
            <h3>Doctor Consultations</h3>
            <p>
              Find qualified doctors, view their availability and schedule
              consultations based on your healthcare needs.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📅</div>
            <span className="service-number">02</span>
            <h3>Appointment Management</h3>
            <p>
              Schedule, view and manage your appointments with organized
              appointment information.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📋</div>
            <span className="service-number">03</span>
            <h3>Medical Records</h3>
            <p>
              Keep important medical records organized and accessible for
              better continuity of care.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">💊</div>
            <span className="service-number">04</span>
            <h3>Prescriptions</h3>
            <p>
              View prescriptions provided by your doctor and keep your
              medication information organized.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">💳</div>
            <span className="service-number">05</span>
            <h3>Billing & Payments</h3>
            <p>
              Access consultation charges, billing information and payment
              records through your patient account.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🔔</div>
            <span className="service-number">06</span>
            <h3>Healthcare Notifications</h3>
            <p>
              Receive important updates related to appointments,
              prescriptions and other healthcare activities.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Services;