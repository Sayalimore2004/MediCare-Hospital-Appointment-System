import { NavLink, Outlet, Link } from "react-router-dom";
import "./AdminDashboardLayout.css";

function AdminDashboardLayout() {
  return (
    <div className="admin-layout">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        {/* Logo */}

        <div className="admin-sidebar-logo">
          <span>✚</span>
          <strong>MediCare</strong>
        </div>


        {/* Admin Profile */}

        <div className="admin-profile">

          <div className="admin-sidebar-avatar">
            AD
          </div>

          <div>
            <strong>Hospital Admin</strong>
            <span>Administrator</span>
          </div>

        </div>


        {/* Navigation */}

        <nav className="admin-dashboard-nav">

          <NavLink
            to="/admin-dashboard"
            end
            className="admin-dashboard-nav-item"
          >
            <span>▦</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/admin-dashboard/patients"
            className="admin-dashboard-nav-item"
          >
            <span>👤</span>
            Patients
          </NavLink>


          <NavLink
            to="/admin-dashboard/appointments"
            className="admin-dashboard-nav-item"
          >
            <span>📅</span>
            Appointments
          </NavLink>


          <NavLink
            to="/admin-dashboard/doctors"
            className="admin-dashboard-nav-item"
          >
            <span>👨‍⚕️</span>
            Doctors
          </NavLink>


          <NavLink
            to="/admin-dashboard/departments"
            className="admin-dashboard-nav-item"
          >
            <span>🏥</span>
            Departments
          </NavLink>


          <NavLink
            to="/admin-dashboard/doctor-access"
            className="admin-dashboard-nav-item"
          >
            <span>🔐</span>
            Doctor Access
          </NavLink>

        </nav>


        {/* Bottom Navigation */}

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-dashboard-nav-item"
          >
            <span>↩</span>
            Back to Website
          </Link>


          <button className="admin-logout-btn">
            <span>⇥</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Page Content */}

      <main className="admin-layout-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminDashboardLayout;
