import { useEffect, useState } from "react";
import "./AdminDepartments.css";

function AdminDepartments() {
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "",
    availability: "Available",
    status: "Active",
  });

  const [editingDepartmentId, setEditingDepartmentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const [error, setError] = useState("");

  /* =========================================
     LOAD DEPARTMENTS
  ========================================= */

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/departments"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch departments."
        );
      }

      setDepartments(data);
    } catch (error) {
      console.error("Fetch departments error:", error);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD DOCTORS
  ========================================= */

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/doctors"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch doctors."
        );
      }

      setDoctors(data);
    } catch (error) {
      console.error("Fetch doctors error:", error);
    }
  };

  /* =========================================
     LOAD DEPARTMENTS + DOCTORS
  ========================================= */

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  /* =========================================
     FORM INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  /* =========================================
     GET DOCTOR COUNT FOR DEPARTMENT
  ========================================= */

  const getDoctorCount = (departmentName) => {
    return doctors.filter(
      (doctor) =>
        doctor.department?.trim().toLowerCase() ===
        departmentName?.trim().toLowerCase()
    ).length;
  };

  /* =========================================
     TOTAL ASSIGNED DOCTORS
  ========================================= */

  const totalAssignedDoctors = doctors.length;

  /* =========================================
     CREATE DEPARTMENT
  ========================================= */

  const handleCreateDepartment = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/departments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create department."
        );
      }

      alert("Department created successfully.");

      setDepartments((previousDepartments) => [
        ...previousDepartments,
        data.department,
      ]);

      setFormData({
        name: "",
        code: "",
        description: "",
        type: "",
        availability: "Available",
        status: "Active",
      });

      setShowAddDepartment(false);
    } catch (error) {
      console.error("Create department error:", error);

      alert(
        error.message ||
          "Failed to create department."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================================
     OPEN EDIT DEPARTMENT
  ========================================= */

  const handleManageDepartment = (department) => {
    setEditingDepartmentId(
      department.departmentId
    );

    setFormData({
      name: department.name || "",
      code: department.code || "",
      description: department.description || "",
      type: department.type || "",
      availability:
        department.availability || "Available",
      status: department.status || "Active",
    });

    setError("");
    setShowEditDepartment(true);
  };

  /* =========================================
     UPDATE DEPARTMENT
  ========================================= */

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/departments/${editingDepartmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update department."
        );
      }

      alert("Department updated successfully.");

      setDepartments((previousDepartments) =>
        previousDepartments.map((department) =>
          department.departmentId ===
          editingDepartmentId
            ? data.department
            : department
        )
      );

      setShowEditDepartment(false);
      setEditingDepartmentId("");

      setFormData({
        name: "",
        code: "",
        description: "",
        type: "",
        availability: "Available",
        status: "Active",
      });

      /*
        Refresh doctors too.

        This is not normally required when editing a department,
        but keeping the data fresh is useful for the doctor counts.
      */
      fetchDoctors();
    } catch (error) {
      console.error("Update department error:", error);

      alert(
        error.message ||
          "Failed to update department."
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================
     ACTIVATE / DEACTIVATE DEPARTMENT
  ========================================= */

  const handleToggleStatus = async (department) => {
    const newStatus =
      department.status === "Active"
        ? "Inactive"
        : "Active";

    const action =
      newStatus === "Inactive"
        ? "deactivate"
        : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} the ${department.name} department?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingStatus(true);

      const response = await fetch(
        `http://localhost:5000/api/departments/${department.departmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: department.name,
            code: department.code,
            description: department.description,
            type: department.type,
            availability: department.availability,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${action} department.`
        );
      }

      setDepartments((previousDepartments) =>
        previousDepartments.map((item) =>
          item.departmentId ===
          department.departmentId
            ? data.department
            : item
        )
      );

      alert(
        `Department ${action}d successfully.`
      );
    } catch (error) {
      console.error(
        "Change department status error:",
        error
      );

      alert(
        error.message ||
          `Failed to ${action} department.`
      );
    } finally {
      setChangingStatus(false);
    }
  };

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  const closeAddModal = () => {
    setShowAddDepartment(false);

    setFormData({
      name: "",
      code: "",
      description: "",
      type: "",
      availability: "Available",
      status: "Active",
    });

    setError("");
  };

  /* =========================================
     CLOSE EDIT MODAL
  ========================================= */

  const closeEditModal = () => {
    setShowEditDepartment(false);
    setEditingDepartmentId("");

    setFormData({
      name: "",
      code: "",
      description: "",
      type: "",
      availability: "Available",
      status: "Active",
    });

    setError("");
  };

  return (
    <div className="admin-departments-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="admin-departments-header">

        <div>
          <span>DEPARTMENT MANAGEMENT</span>

          <h1>Departments</h1>

          <p>
            Manage hospital departments, assigned doctors and department
            availability.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-department-btn"
          onClick={() => {
            setError("");

            setFormData({
              name: "",
              code: "",
              description: "",
              type: "",
              availability: "Available",
              status: "Active",
            });

            setShowAddDepartment(true);
          }}
        >
          + Add Department
        </button>

      </header>


      {/* =========================================
          STATS
      ========================================= */}

      <section className="admin-department-stats">

        <div className="admin-department-stat">
          <span>Total Departments</span>

          <strong>
            {departments.length}
          </strong>
        </div>


        <div className="admin-department-stat">
          <span>Active Departments</span>

          <strong>
            {
              departments.filter(
                (department) =>
                  department.status === "Active"
              ).length
            }
          </strong>
        </div>


        <div className="admin-department-stat">
          <span>Doctors Assigned</span>

          <strong>
            {totalAssignedDoctors}
          </strong>
        </div>


        <div className="admin-department-stat">
          <span>Available Departments</span>

          <strong>
            {
              departments.filter(
                (department) =>
                  department.availability ===
                  "Available"
              ).length
            }
          </strong>
        </div>

      </section>


      {/* =========================================
          DEPARTMENT DIRECTORY
      ========================================= */}

      <section className="admin-departments-card">

        <div className="admin-departments-card-heading">

          <div>
            <span>DEPARTMENT DIRECTORY</span>

            <h2>Hospital Departments</h2>
          </div>

        </div>


        <div className="admin-department-table">

          <div className="admin-department-table-header">

            <span>Department</span>

            <span>Code</span>

            <span>Doctors</span>

            <span>Availability</span>

            <span>Status</span>

            <span>Action</span>

          </div>


          {loading ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              Loading departments...
            </div>

          ) : error ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              {error}
            </div>

          ) : departments.length === 0 ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              No departments found.
            </div>

          ) : (

            departments.map((department) => {

              const doctorCount =
                getDoctorCount(
                  department.name
                );

              return (
                <DepartmentRow
                  key={department._id}

                  icon={getDepartmentIcon(
                    department.type
                  )}

                  name={department.name}

                  description={
                    department.description
                  }

                  code={department.code}

                  doctors={`${doctorCount} ${
                    doctorCount === 1
                      ? "Doctor"
                      : "Doctors"
                  }`}

                  availability={
                    department.availability
                  }

                  limited={
                    department.availability ===
                    "Limited"
                  }

                  status={department.status}

                  onManage={() =>
                    handleManageDepartment(
                      department
                    )
                  }

                  onToggleStatus={() =>
                    handleToggleStatus(
                      department
                    )
                  }

                  changingStatus={
                    changingStatus
                  }
                />
              );
            })

          )}

        </div>

      </section>


      {/* =========================================
          HOSPITAL OVERVIEW
      ========================================= */}

      <section className="admin-department-overview-card">

        <div className="admin-departments-card-heading">

          <div>
            <span>HOSPITAL OVERVIEW</span>

            <h2>Department Summary</h2>
          </div>

        </div>


        <div className="admin-department-overview">

          <div className="admin-overview-item">

            <strong>
              {
                departments.filter(
                  (department) =>
                    department.type ===
                    "Clinical"
                ).length
              }
            </strong>

            <span>
              Clinical Departments
            </span>

          </div>


          <div className="admin-overview-item">

            <strong>
              {
                departments.filter(
                  (department) =>
                    department.type ===
                    "Diagnostic"
                ).length
              }
            </strong>

            <span>
              Diagnostic Departments
            </span>

          </div>


          <div className="admin-overview-item">

            <strong>
              {
                departments.filter(
                  (department) =>
                    department.type ===
                    "Support"
                ).length
              }
            </strong>

            <span>
              Support Department
            </span>

          </div>

        </div>

      </section>


      {/* =========================================
          ADD DEPARTMENT MODAL
      ========================================= */}

      {showAddDepartment && (

        <div className="admin-department-modal-overlay">

          <div className="admin-department-modal">

            <div className="admin-department-modal-header">

              <div>

                <span>
                  DEPARTMENT SETUP
                </span>

                <h2>
                  Add New Department
                </h2>

                <p>
                  Enter department information to add a new hospital
                  department.
                </p>

              </div>


              <button
                type="button"
                className="admin-department-modal-close"
                onClick={closeAddModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleCreateDepartment
              }
            >

              <DepartmentForm
                formData={formData}
                handleChange={handleChange}
              />


              <div className="admin-department-form-note">

                <strong>
                  Department management
                </strong>

                <span>
                  Doctors can be assigned to this department after it
                  has been created.
                </span>

              </div>


              <div className="admin-department-modal-actions">

                <button
                  type="button"
                  className="admin-department-cancel-btn"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-department-create-btn"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Department"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =========================================
          EDIT DEPARTMENT MODAL
      ========================================= */}

      {showEditDepartment && (

        <div className="admin-department-modal-overlay">

          <div className="admin-department-modal">

            <div className="admin-department-modal-header">

              <div>

                <span>
                  DEPARTMENT MANAGEMENT
                </span>

                <h2>
                  Edit Department
                </h2>

                <p>
                  Update department information and availability.
                </p>

              </div>


              <button
                type="button"
                className="admin-department-modal-close"
                onClick={closeEditModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleUpdateDepartment
              }
            >

              <DepartmentForm
                formData={formData}
                handleChange={handleChange}
              />


              <div className="admin-department-form-note">

                <strong>
                  Department management
                </strong>

                <span>
                  Changes will be saved to the hospital department
                  database.
                </span>

              </div>


              <div className="admin-department-modal-actions">

                <button
                  type="button"
                  className="admin-department-cancel-btn"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-department-create-btn"
                  disabled={updating}
                >
                  {updating
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================
   DEPARTMENT FORM
========================================= */

function DepartmentForm({
  formData,
  handleChange,
}) {
  return (
    <div className="admin-department-form-grid">

      {/* Department Name */}

      <div className="admin-department-form-group">

        <label>
          Department Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Cardiology"
          required
        />

      </div>


      {/* Department Code */}

      <div className="admin-department-form-group">

        <label>
          Department Code
        </label>

        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. CAR"
          maxLength="5"
          required
        />

      </div>


      {/* Description */}

      <div className="admin-department-form-group admin-department-full-width">

        <label>
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter department description"
          rows="3"
          required
        />

      </div>


      {/* Department Type */}

      <div className="admin-department-form-group">

        <label>
          Department Type
        </label>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >

          <option value="" disabled>
            Select Type
          </option>

          <option value="Clinical">
            Clinical
          </option>

          <option value="Diagnostic">
            Diagnostic
          </option>

          <option value="Support">
            Support
          </option>

        </select>

      </div>


      {/* Availability */}

      <div className="admin-department-form-group">

        <label>
          Availability
        </label>

        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
        >

          <option value="Available">
            Available
          </option>

          <option value="Limited">
            Limited
          </option>

          <option value="Unavailable">
            Unavailable
          </option>

        </select>

      </div>


      {/* Status */}

      <div className="admin-department-form-group">

        <label>
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>

      </div>

    </div>
  );
}


/* =========================================
   DEPARTMENT ICON
========================================= */

function getDepartmentIcon(type) {
  if (type === "Clinical") {
    return "❤";
  }

  if (type === "Diagnostic") {
    return "◉";
  }

  if (type === "Support") {
    return "✚";
  }

  return "✦";
}


/* =========================================
   DEPARTMENT ROW
========================================= */

function DepartmentRow({
  icon,
  name,
  description,
  code,
  doctors,
  availability,
  limited = false,
  status,
  onManage,
  onToggleStatus,
  changingStatus,
}) {
  return (
    <div className="admin-department-table-row">

      <div className="admin-department-info">

        <div className="admin-department-icon">
          {icon}
        </div>

        <div>

          <strong>
            {name}
          </strong>

          <span>
            {description}
          </span>

        </div>

      </div>


      <span>
        {code}
      </span>


      <span>
        {doctors}
      </span>


      <span
        className={
          limited
            ? "admin-department-limited"
            : "admin-department-available"
        }
      >
        {availability}
      </span>


      <span
        className={
          status === "Active"
            ? "admin-department-active"
            : "admin-department-limited"
        }
      >
        {status}
      </span>


      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >

        <button
          type="button"
          onClick={onManage}
        >
          Manage
        </button>


        <button
          type="button"
          onClick={onToggleStatus}
          disabled={changingStatus}
          style={{
            opacity: changingStatus ? 0.6 : 1,
            cursor: changingStatus
              ? "not-allowed"
              : "pointer",
          }}
        >
          {changingStatus
            ? "Updating..."
            : status === "Active"
            ? "Deactivate"
            : "Activate"}
        </button>

      </div>

    </div>
  );
}


export default AdminDepartments;