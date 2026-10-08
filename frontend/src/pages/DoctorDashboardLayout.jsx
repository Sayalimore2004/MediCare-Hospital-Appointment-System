import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./DoctorDashboardLayout.css";

function DoctorDashboardLayout() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in doctor
  useEffect(() => {
    const loadDoctor = () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const savedDoctor = localStorage.getItem("doctorData");

        if (!token || !savedDoctor) {
          navigate("/login");
          return;
        }

        const doctorData = JSON.parse(savedDoctor);

        if (!doctorData?.doctorId) {
          localStorage.removeItem("doctorToken");
          localStorage.removeItem("doctorData");
          localStorage.removeItem("rememberDoctor");
          navigate("/login");
          return;
        }

        setDoctor(doctorData);
      } catch (error) {
        console.error("Failed to load doctor information:", error);

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctorData");
        localStorage.removeItem("rememberDoctor");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [navigate]);

  // Doctor logout
  const handleLogout = async () => {
    try {
      const savedDoctor = localStorage.getItem("doctorData");

      if (savedDoctor) {
        const doctorData = JSON.parse(savedDoctor);

        if (doctorData?.doctorId) {
          await fetch(
            "http://localhost:5000/api/doctors/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                doctorId: doctorData.doctorId
              })
            }
          );
        }
      }
    } catch (error) {
      console.error("Doctor logout error:", error);
    } finally {
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctorData");
      localStorage.removeItem("rememberDoctor");

      navigate("/login");
    }
  };

  // Generate initials
  const doctorInitials = doctor?.name
    ? doctor.name
        .replace(/^Dr\.\s*/i, "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
    : "DR";

  if (loading) {
    return (
      <div className="doctor-layout">
        <aside className="doctor-sidebar">
          <div className="doctor-sidebar-logo">
            <span>✚</span>
            <strong>MediCare</strong>
          </div>
        </aside>

        <main className="doctor-layout-main">
          <div className="doctor-dashboard-loading">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="doctor-layout">

      {/* Sidebar */}
      <aside className="doctor-sidebar">

        {/* Logo */}
        <div className="doctor-sidebar-logo">
          <span>✚</span>
          <strong>MediCare</strong>
        </div>

        {/* Doctor Profile */}
        <div className="doctor-profile">
          <div className="doctor-sidebar-avatar">
            {doctorInitials}
          </div>

          <div>
            <strong>{doctor.name}</strong>
            <span>{doctor.specialization}</span>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="doctor-dashboard-nav">

          <NavLink
            to="/doctor-dashboard"
            end
            className="doctor-dashboard-nav-item"
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/doctor-dashboard/appointments"
            className="doctor-dashboard-nav-item"
          >
            <span>📅</span>
            Appointments
          </NavLink>

          <NavLink
            to="/doctor-dashboard/patients"
            className="doctor-dashboard-nav-item"
          >
            <span>👥</span>
            My Patients
          </NavLink>

          <NavLink
            to="/doctor-dashboard/schedule"
            className="doctor-dashboard-nav-item"
          >
            <span>🕐</span>
            My Schedule
          </NavLink>

          <NavLink
            to="/doctor-dashboard/medical-records"
            className="doctor-dashboard-nav-item"
          >
            <span>📋</span>
            Medical Records
          </NavLink>

          <NavLink
            to="/doctor-dashboard/prescriptions"
            className="doctor-dashboard-nav-item"
          >
            <span>💊</span>
            Prescriptions
          </NavLink>

          <NavLink
            to="/doctor-dashboard/profile"
            className="doctor-dashboard-nav-item"
          >
            <span>👤</span>
            My Profile
          </NavLink>

          <NavLink
            to="/doctor-dashboard/notifications"
            className="doctor-dashboard-nav-item"
          >
            <span>🔔</span>
            Notifications
          </NavLink>

        </nav>

        {/* Fixed Bottom Section */}
        <div className="doctor-sidebar-bottom">

          <Link
            to="/"
            className="doctor-dashboard-nav-item"
          >
            <span>↩</span>
            Back to Website
          </Link>

          <button
            type="button"
            className="doctor-logout-btn"
            onClick={handleLogout}
          >
            <span>⇥</span>
            Logout
          </button>

        </div>

      </aside>

      {/* Page Content */}
      <main className="doctor-layout-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DoctorDashboardLayout;