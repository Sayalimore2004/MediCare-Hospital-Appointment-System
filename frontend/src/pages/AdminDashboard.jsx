import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState(null);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard-stats"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics.");
      }

      const data = await response.json();

      setDashboardStats(data);
    } catch (error) {
      console.error("Dashboard statistics error:", error);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/departments"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch departments.");
      }

      const data = await response.json();

      setDepartmentsList(data);
    } catch (error) {
      console.error("Fetch departments error:", error);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchDepartments();
  }, []);

  const patients = dashboardStats?.patients;
  const doctors = dashboardStats?.doctors;
  const departments = dashboardStats?.departments;
  const appointments = dashboardStats?.appointments;
  const onlineUsers = dashboardStats?.onlineUsers;

  return (
    <div className="admin-dashboard-page">

      {/* Header */}

      <header className="admin-dashboard-header">

        <div>
          <span>ADMINISTRATION</span>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor hospital users, doctors, departments and account access
            from one place.
          </p>
        </div>

        <div className="admin-header-profile">

          <div className="admin-top-avatar">
            AD
          </div>

          <div>
            <strong>Hospital Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </header>


      {/* Error */}

      {error && (
        <div className="admin-dashboard-error">
          {error}
        </div>
      )}


      {/* Statistics */}

      <section className="admin-dashboard-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👤
          </div>

          <div>
            <span>Total Patients</span>

            <strong>
              {loading ? "..." : patients?.total ?? 0}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👨‍⚕️
          </div>

          <div>
            <span>Total Doctors</span>

            <strong>
              {loading ? "..." : doctors?.total ?? 0}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🟢
          </div>

          <div>
            <span>Active Doctors</span>

            <strong>
              {loading ? "..." : doctors?.active ?? 0}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏥
          </div>

          <div>
            <span>Departments</span>

            <strong>
              {loading ? "..." : departments?.total ?? 0}
            </strong>
          </div>

        </div>

      </section>


      {/* Login Activity */}

      <section className="admin-login-activity">

        <div className="admin-dashboard-card admin-login-card">

          <div className="admin-card-heading">

            <div>
              <span>LIVE USER ACTIVITY</span>
              <h2>Current Login Status</h2>
            </div>

          </div>


          <div className="admin-login-grid">

            <div className="admin-login-item">

              <div className="admin-login-icon">
                👤
              </div>

              <div>
                <span>Patients Currently Logged In</span>

                <strong>
                  {loading ? "..." : onlineUsers?.patients ?? 0}
                </strong>
              </div>

              <small>Active now</small>

            </div>


            <div className="admin-login-item">

              <div className="admin-login-icon">
                👨‍⚕️
              </div>

              <div>
                <span>Doctors Currently Logged In</span>

                <strong>
                  {loading ? "..." : onlineUsers?.doctors ?? 0}
                </strong>
              </div>

              <small>Active now</small>

            </div>

          </div>

        </div>


        {/* Doctor Access */}

        <div className="admin-dashboard-card admin-access-card">

          <div className="admin-card-heading">

            <div>
              <span>ACCOUNT MANAGEMENT</span>
              <h2>Doctor Access</h2>
            </div>

          </div>


          <div className="admin-access-list">

            <div className="admin-access-row">

              <div>
                <strong>Active Accounts</strong>
                <span>Doctors with login access</span>
              </div>

              <strong>
                {loading ? "..." : doctors?.active ?? 0}
              </strong>

            </div>


            <div className="admin-access-row">

              <div>
                <strong>Pending Accounts</strong>
                <span>Doctors awaiting approval</span>
              </div>

              <strong>0</strong>

            </div>


            <div className="admin-access-row">

              <div>
                <strong>Inactive Accounts</strong>
                <span>Doctor access currently disabled</span>
              </div>

              <strong>
                {loading ? "..." : doctors?.inactive ?? 0}
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* Department Overview */}

      <section className="admin-dashboard-card admin-department-card">

        <div className="admin-card-heading">

          <div>
            <span>DEPARTMENT OVERVIEW</span>
            <h2>Hospital Departments</h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/departments")
            }
          >
            Manage Departments →
          </button>

        </div>


        <div className="admin-department-grid">

          {departmentsLoading ? (
            <div className="admin-department-item">
              <strong>Loading...</strong>
              <span>Fetching departments</span>
            </div>
          ) : departmentsList.length === 0 ? (
            <div className="admin-department-item">
              <strong>No Departments</strong>
              <span>No departments found</span>
            </div>
          ) : (
            departmentsList.map((department) => (
              <div
                className="admin-department-item"
                key={department.departmentId}
              >
                <strong>
                  {department.name}
                </strong>

                <span>
                  {department.code || "Department"}
                </span>
              </div>
            ))
          )}

        </div>

      </section>


      {/* Appointment Overview */}

      <section className="admin-dashboard-card admin-quick-actions-card">

        <div className="admin-card-heading">

          <div>
            <span>APPOINTMENT OVERVIEW</span>
            <h2>Appointment Status</h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/appointments")
            }
          >
            View Appointments →
          </button>

        </div>


        <div className="admin-quick-actions">

          <button type="button">

            <span>📅</span>

            <div>
              <strong>
                {loading ? "..." : appointments?.total ?? 0}
              </strong>

              <small>Total Appointments</small>
            </div>

          </button>


          <button type="button">

            <span>🟢</span>

            <div>
              <strong>
                {loading ? "..." : appointments?.confirmed ?? 0}
              </strong>

              <small>Confirmed Appointments</small>
            </div>

          </button>


          <button type="button">

            <span>🔵</span>

            <div>
              <strong>
                {loading ? "..." : appointments?.completed ?? 0}
              </strong>

              <small>Completed Appointments</small>
            </div>

          </button>

        </div>

      </section>


      {/* Quick Actions */}

      <section className="admin-dashboard-card admin-quick-actions-card">

        <div className="admin-card-heading">

          <div>
            <span>QUICK ACTIONS</span>
            <h2>Administration</h2>
          </div>

        </div>


        <div className="admin-quick-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/doctors")
            }
          >

            <span>👨‍⚕️</span>

            <div>
              <strong>Manage Doctors</strong>
              <small>View and manage doctor accounts</small>
            </div>

          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/doctor-access")
            }
          >

            <span>🔐</span>

            <div>
              <strong>Doctor Access</strong>
              <small>Manage doctor login permissions</small>
            </div>

          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/departments")
            }
          >

            <span>🏥</span>

            <div>
              <strong>Manage Departments</strong>
              <small>Manage hospital departments</small>
            </div>

          </button>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;
