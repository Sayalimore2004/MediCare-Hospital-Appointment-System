import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import "./PatientDashboardLayout.css";

function PatientDashboardLayout() {
  const navigate = useNavigate();

  // Logout
  const handleLogout = async () => {
    try {
      const patientData = JSON.parse(
        localStorage.getItem("patientData")
      );

      // Tell backend that patient has logged out
      if (patientData?.patientId) {
        await fetch(
          "http://localhost:5000/api/patients/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: patientData.patientId,
            }),
          }
        );
      }
    } catch (error) {
      console.error(
        "Patient logout error:",
        error
      );
    } finally {
      // Clear patient login information
      localStorage.removeItem("patientData");
      localStorage.removeItem("rememberPatient");

      // Return to login page
      navigate("/login");
    }
  };

  return (
    <div className="patient-layout">

      {/* Sidebar */}

      <aside className="patient-sidebar">

        <div className="sidebar-logo">
          <span>✚</span>
          <strong>MediCare</strong>
        </div>


        <div className="patient-profile">

          <div className="patient-avatar">
            S
          </div>

          <div>
            <strong>Sayali More</strong>
            <span>Patient</span>
          </div>

        </div>


        {/* Navigation */}

        <nav className="dashboard-nav">

          <NavLink
            to="/patient-dashboard"
            end
            className="dashboard-nav-item"
          >
            <span>▦</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/patient-dashboard/appointments"
            className="dashboard-nav-item"
          >
            <span>📅</span>
            Appointments
          </NavLink>


          <Link
            to="/doctors"
            className="dashboard-nav-item"
          >
            <span>👨‍⚕️</span>
            Find a Doctor
          </Link>


          <NavLink
            to="/patient-dashboard/medical-records"
            className="dashboard-nav-item"
          >
            <span>📋</span>
            Medical Records
          </NavLink>


          <NavLink
            to="/patient-dashboard/prescriptions"
            className="dashboard-nav-item"
          >
            <span>💊</span>
            Prescriptions
          </NavLink>


          <NavLink
            to="/patient-dashboard/bills"
            className="dashboard-nav-item"
          >
            <span>💳</span>
            Bills & Payments
          </NavLink>


          <NavLink
            to="/patient-dashboard/notifications"
            className="dashboard-nav-item"
          >
            <span>🔔</span>
            Notifications
          </NavLink>

        </nav>


        {/* Bottom Navigation */}

        <div className="sidebar-bottom">

          <Link
            to="/"
            className="dashboard-nav-item"
          >
            <span>↩</span>
            Back to Website
          </Link>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>⇥</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Page Content */}

      <main className="patient-layout-main">
        <Outlet />
      </main>

    </div>
  );
}

export default PatientDashboardLayout;