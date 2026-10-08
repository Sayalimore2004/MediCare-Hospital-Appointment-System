import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Services from "./pages/Services";
import PatientDashboard from "./pages/PatientDashboard";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import Bills from "./pages/Bills";
import Notifications from "./pages/Notifications";
import PatientDashboardLayout from "./pages/PatientDashboardLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorDashboardLayout from "./pages/DoctorDashboardLayout";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients"; 
import DoctorSchedule from "./pages/DoctorSchedule";
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorProfileDashboard from "./pages/DoctorProfileDashboard";
import DoctorNotifications from "./pages/DoctorNotifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardLayout from "./pages/AdminDashboardLayout";
import AdminDoctors from "./pages/AdminDoctors";
import AdminDepartments from "./pages/AdminDepartments";
import AdminDoctorAccess from "./pages/AdminDoctorAccess";
import AdminPatients from "./pages/AdminPatients";
import AdminAppointments from "./pages/AdminAppointments";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            <span>●</span> Trusted Healthcare Platform
          </div>

          <h1>
            Your health,
            <br />
            <span>managed in one place.</span>
          </h1>

          <p>
            Find the right doctor, manage appointments, access medical
            records, prescriptions and more through one secure platform.
          </p>

          <div className="hero-buttons">

            <Link to="/doctors" className="primary-btn">
              Find a Doctor
            </Link>

            <Link to="/departments" className="secondary-btn">
               View Departments
            </Link>

          </div>

          <div className="hero-info">

            <div>
              <strong>50+</strong>
              <span>Doctors</span>
            </div>

            <div>
              <strong>10+</strong>
              <span>Departments</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Patient Support</span>
            </div>

          </div>

        </div>


        {/* Healthcare Dashboard Preview */}
        <div className="dashboard-preview">

          <div className="dashboard-header">

            <div>
              <span className="small-label">PATIENT DASHBOARD</span>
              <h3>Good morning 👋</h3>
            </div>

            <div className="profile-circle">SM</div>

          </div>


          {/* Appointment Card */}
          <div className="appointment-card">

            <div className="card-top">
              <span>UPCOMING APPOINTMENT</span>
              <span className="status">Confirmed</span>
            </div>

            <div className="doctor-info">

              <div className="doctor-avatar">
                👨‍⚕️
              </div>

              <div>
                <h4>Dr. Rahul Sharma</h4>
                <p>Cardiologist</p>
              </div>

            </div>

            <div className="appointment-details">

              <div>
                <span>DATE</span>
                <strong>18 Sep 2026</strong>
              </div>

              <div>
                <span>TIME</span>
                <strong>10:30 AM</strong>
              </div>

            </div>

            <button className="appointment-btn">
              View Appointment
            </button>

          </div>


          {/* Dashboard Bottom Cards */}
          <div className="mini-cards">

            <div className="mini-card">

              <div className="mini-icon">📋</div>

              <div>
                <span>Medical Records</span>
                <strong>12 Records</strong>
              </div>

            </div>

            <div className="mini-card">

              <div className="mini-icon">💊</div>

              <div>
                <span>Prescriptions</span>
                <strong>4 Active</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Departments */}
      <section className="departments" id="departments">

        <div className="section-heading">

          <span>OUR SPECIALITIES</span>

          <h2>Medical Departments</h2>

          <p>
            Comprehensive healthcare services from experienced medical
            professionals.
          </p>

        </div>

        <div className="department-grid">

          <div className="department-card">
            <div className="department-icon">❤️</div>
            <h3>Cardiology</h3>
            <p>Heart and cardiovascular care</p>
          </div>

          <div className="department-card">
            <div className="department-icon">🧠</div>
            <h3>Neurology</h3>
            <p>Brain and nervous system care</p>
          </div>

          <div className="department-card">
            <div className="department-icon">🦴</div>
            <h3>Orthopedics</h3>
            <p>Bones, joints and muscles</p>
          </div>

          <div className="department-card">
            <div className="department-icon">🩺</div>
            <h3>General Medicine</h3>
            <p>Complete primary healthcare</p>
          </div>

        </div>

      </section>


      {/* Doctors */}
      <section className="doctors" id="doctors">

        <div className="section-heading">

          <span>OUR DOCTORS</span>

          <h2>Meet Our Specialists</h2>

          <p>
            Experienced professionals dedicated to providing quality care.
          </p>

        </div>

        <div className="doctor-grid">

          <div className="doctor-card">

            <div className="doctor-photo">👨‍⚕️</div>

            <h3>Dr. Rahul Sharma</h3>

            <p>Cardiologist</p>

            <Link to="/doctors/rahul-sharma" className="view-profile-btn">
  View Profile →
</Link>

          </div>

          <div className="doctor-card">

            <div className="doctor-photo">👩‍⚕️</div>

            <h3>Dr. Priya Mehta</h3>

            <p>Neurologist</p>

            <Link to="/doctors/priya-mehta" className="view-profile-btn">
              View Profile →
            </Link>

          </div>

          <div className="doctor-card">

            <div className="doctor-photo">👨‍⚕️</div>

            <h3>Dr. Amit Patil</h3>

            <p>Orthopedic Specialist</p>

            <Link to="/doctors/amit-patil" className="view-profile-btn">
              View Profile →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


function App() {
  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">

        <div className="logo">
          <span className="logo-icon">✚</span>
          <span>MediCare</span>
        </div>

        <nav>

          <Link to="/">Home</Link>

          <Link to="/doctors">Doctors</Link>

          <Link to="/departments">Departments</Link>

          <Link to="/services">Services</Link>

        </nav>

        <div className="nav-actions">
  <Link to="/login" className="login-btn">
    Login
  </Link>

  <Link to="/register" className="signup-btn">
    Register
  </Link>
</div>

      </header>


      {/* Pages */}
      <main>

        <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/doctors" element={<Doctors />} />

  <Route path="/departments" element={<Departments />} />

  <Route
    path="/doctors/:doctorId"
    element={<DoctorProfile />}
  />

  <Route
    path="/book-appointment/:doctorId"
    element={<BookAppointment />}
  />

  <Route path="/register" element={<Register />} />

  <Route path="/login" element={<Login />} />

  <Route path="/services" element={<Services />} />


  {/* Patient Dashboard */}

  <Route
    path="/patient-dashboard"
    element={<PatientDashboardLayout />}
  >

    <Route
      index
      element={<PatientDashboard />}
    />

    <Route
      path="appointments"
      element={<Appointments />}
    />

    <Route
      path="medical-records"
      element={<MedicalRecords />}
    />

    <Route
      path="prescriptions"
      element={<Prescriptions />}
    />

    <Route
      path="bills"
      element={<Bills />}
    />

    <Route
      path="notifications"
      element={<Notifications />}
    />

  </Route>

  {/* Doctor Dashboard */}
<Route path="/doctor-dashboard" element={<DoctorDashboardLayout />}>
  <Route index element={<DoctorDashboard />} />
  <Route path="appointments" element={<DoctorAppointments />} />
  <Route path="patients" element={<DoctorPatients />} />
  <Route path="schedule" element={<DoctorSchedule />} />
  <Route path="medical-records" element={<DoctorMedicalRecords />} />
  <Route path="prescriptions" element={<DoctorPrescriptions />} />
  <Route path="profile" element={<DoctorProfileDashboard />} />
  <Route path="notifications" element={<DoctorNotifications />} />

</Route>


{/* Admin Dashboard */}
<Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="patients" element={<AdminPatients />} />
  <Route path="doctors" element={<AdminDoctors />} />
  <Route path="departments" element={<AdminDepartments />} />
  <Route path="doctor-access" element={<AdminDoctorAccess />} />
  <Route path="appointments" element={<AdminAppointments />} />
</Route>


</Routes>

      </main>

    </div>
  );
}

export default App;