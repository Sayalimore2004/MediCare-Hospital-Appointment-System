import { useEffect, useState } from "react";
import "./AdminDoctors.css";

function AdminDoctors() {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showManageDoctor, setShowManageDoctor] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [creatingDoctor, setCreatingDoctor] = useState(false);
  const [error, setError] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    qualification: "",
    specialization: "",
    department: "",
    experience: "",
    consultationFee: "",
    status: "Active",
  });

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  /* LOAD DOCTORS AND DEPARTMENTS */

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/doctors"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch doctors."
        );
      }

      const backendDoctors = data.map((doctor) => ({
        id: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        consultationFee: String(
          doctor.consultationFee
        ),
        status: doctor.status,
        access: doctor.accountAccess,
        password: "",
      }));

      setDoctors(backendDoctors);
    } catch (error) {
      console.error(
        "Failed to fetch doctors:",
        error
      );

      setError(
        "Unable to load doctors from the backend. Please make sure the MediCare backend is running."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  /* LOAD DEPARTMENTS */

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);

      const response = await fetch(
        "http://localhost:5000/api/departments"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch departments."
        );
      }

      const activeDepartments = data.filter(
        (department) =>
          department.status === "Active"
      );

      setDepartments(activeDepartments);
    } catch (error) {
      console.error(
        "Failed to fetch departments:",
        error
      );

      setError(
        "Unable to load departments from the backend."
      );
    } finally {
      setLoadingDepartments(false);
    }
  };

  /* ADD DOCTOR */

  const handleAddDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorForm({
      ...doctorForm,
      [name]: value,
    });

    setError("");
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    setError("");
    setCreatingDoctor(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/doctors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: doctorForm.name.trim(),
            email: doctorForm.email.trim(),
            phone: doctorForm.phone.trim(),
            gender: doctorForm.gender,
            qualification:
              doctorForm.qualification.trim(),
            specialization:
              doctorForm.specialization.trim(),
            department:
              doctorForm.department.trim(),
            experience:
              doctorForm.experience.trim(),
            consultationFee: Number(
              doctorForm.consultationFee
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to create doctor."
        );
        return;
      }

      const newDoctor = {
        id: data.doctor.doctorId,
        name: data.doctor.name,
        email: data.doctor.email,
        phone: data.doctor.phone,
        gender: data.doctor.gender,
        qualification:
          data.doctor.qualification,
        specialization:
          data.doctor.specialization,
        department:
          data.doctor.department,
        experience:
          data.doctor.experience,
        consultationFee: String(
          data.doctor.consultationFee
        ),
        status: data.doctor.status,
        access: data.doctor.accountAccess,
        password:
          data.credentials.temporaryPassword,
      };

      setDoctors((currentDoctors) => [
        ...currentDoctors,
        newDoctor,
      ]);

      setCredentials({
        email: data.credentials.email,
        password:
          data.credentials.temporaryPassword,
      });

      setSelectedDoctor(newDoctor);

      setShowAddDoctor(false);
      setShowCredentials(true);

      setDoctorForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        qualification: "",
        specialization: "",
        department: "",
        experience: "",
        consultationFee: "",
        status: "Active",
      });
    } catch (error) {
      console.error(
        "Create doctor error:",
        error
      );

      setError(
        "Unable to connect to the backend. Please make sure the MediCare backend is running."
      );
    } finally {
      setCreatingDoctor(false);
    }
  };

  /* MANAGE DOCTOR */

  const handleManageDoctor = (doctor) => {
    setSelectedDoctor(doctor);

    setDoctorForm({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      qualification: doctor.qualification,
      specialization: doctor.specialization,
      department: doctor.department,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      status: doctor.status,
    });

    setError("");
    setShowManageDoctor(true);
  };

  const handleEditDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorForm({
      ...doctorForm,
      [name]: value,
    });

    setError("");
  };

  /* UPDATE DOCTOR IN MONGODB */

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/doctors/${selectedDoctor.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: doctorForm.name.trim(),
            email: doctorForm.email.trim(),
            phone: doctorForm.phone.trim(),
            gender: doctorForm.gender,
            qualification:
              doctorForm.qualification.trim(),
            specialization:
              doctorForm.specialization.trim(),
            department:
              doctorForm.department.trim(),
            experience:
              doctorForm.experience.trim(),
            consultationFee: Number(
              doctorForm.consultationFee
            ),
            status: doctorForm.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update doctor information."
        );
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) => {
          if (doctor.id !== selectedDoctor.id) {
            return doctor;
          }

          return {
            ...doctor,
            id: data.doctor.doctorId,
            name: data.doctor.name,
            email: data.doctor.email,
            phone: data.doctor.phone,
            gender: data.doctor.gender,
            qualification:
              data.doctor.qualification,
            specialization:
              data.doctor.specialization,
            department:
              data.doctor.department,
            experience:
              data.doctor.experience,
            consultationFee: String(
              data.doctor.consultationFee
            ),
            status: data.doctor.status,
            access:
              data.doctor.accountAccess,
            password: doctor.password,
          };
        })
      );

      setShowManageDoctor(false);
      setSelectedDoctor(null);

      alert(
        "Doctor information updated successfully."
      );
    } catch (error) {
      console.error(
        "Update doctor error:",
        error
      );

      setError(
        error.message ||
          "Unable to update doctor information."
      );
    }
  };

  /* STATUS */

  const handleStatusChange = async (doctor) => {
    try {
      setError("");

      const newAccess =
        doctor.access === "Enabled"
          ? "Disabled"
          : "Enabled";

      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctor.id}/access`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountAccess: newAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update doctor access."
        );
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((currentDoctor) => {
          if (currentDoctor.id !== doctor.id) {
            return currentDoctor;
          }

          return {
            ...currentDoctor,
            status: data.doctor.status,
            access: data.doctor.accountAccess,
          };
        })
      );
    } catch (error) {
      console.error(
        "Update doctor access error:",
        error
      );

      setError(
        error.message ||
          "Unable to update doctor account access."
      );
    }
  };

  /* CREDENTIALS */

  const handleViewCredentials = (doctor) => {
    if (!doctor.password) {
      setCredentials({
        email: doctor.email,
        password:
          "Password cannot be viewed after creation.",
      });
    } else {
      setCredentials({
        email: doctor.email,
        password: doctor.password,
      });
    }

    setSelectedDoctor(doctor);
    setShowCredentials(true);
  };

  const handleCopyCredentials = () => {
    const text = `Doctor Login
Email: ${credentials.email}
Temporary Password: ${credentials.password}`;

    navigator.clipboard.writeText(text);

    alert("Credentials copied successfully.");
  };

  const closeAllModals = () => {
    setShowAddDoctor(false);
    setShowManageDoctor(false);
    setShowCredentials(false);
    setSelectedDoctor(null);
    setError("");
  };

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active"
  ).length;

  const pendingDoctors = doctors.filter(
    (doctor) => doctor.status === "Pending"
  ).length;

  const inactiveDoctors = doctors.filter(
    (doctor) => doctor.status === "Inactive"
  ).length;

  return (
    <div className="admin-doctors-page">

      {/* HEADER */}

      <header className="admin-doctors-header">

        <div>
          <span>DOCTOR MANAGEMENT</span>

          <h1>Doctors</h1>

          <p>
            Manage doctor profiles, departments, account
            status and login access.
          </p>
        </div>

        <button
          className="admin-add-doctor-btn"
          onClick={() => {
            setError("");
            setShowAddDoctor(true);
          }}
        >
          + Add Doctor
        </button>

      </header>

      {/* STATS */}

      <section className="admin-doctor-stats">

        <div className="admin-doctor-stat-card">
          <span>Total Doctors</span>
          <strong>{doctors.length}</strong>
        </div>

        <div className="admin-doctor-stat-card">
          <span>Active</span>
          <strong>{activeDoctors}</strong>
        </div>

        <div className="admin-doctor-stat-card">
          <span>Pending</span>
          <strong>{pendingDoctors}</strong>
        </div>

        <div className="admin-doctor-stat-card">
          <span>Inactive</span>
          <strong>{inactiveDoctors}</strong>
        </div>

      </section>

      {/* DOCTOR DIRECTORY */}

      <section className="admin-doctor-directory">

        <div className="admin-doctor-directory-header">

          <div>
            <span>DOCTOR DIRECTORY</span>
            <h2>All Doctors</h2>
          </div>

          <p>
            {doctors.length} doctors registered
          </p>

        </div>

        <div className="admin-doctor-table-wrapper">

          {loadingDoctors ? (

            <div className="admin-doctor-loading">
              Loading doctors...
            </div>

          ) : error && !showAddDoctor && !showManageDoctor ? (

            <div className="admin-doctor-loading">

              <p>{error}</p>

              <button
                type="button"
                className="manage-doctor-btn"
                onClick={() => {
                  fetchDoctors();
                  fetchDepartments();
                }}
              >
                Try Again
              </button>

            </div>

          ) : doctors.length === 0 ? (

            <div className="admin-doctor-loading">
              No doctors found in the database.
            </div>

          ) : (

            <table className="admin-doctor-table">

              <thead>

                <tr>
                  <th>Doctor</th>
                  <th>ID</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {doctors.map((doctor) => (

                  <tr key={doctor.id}>

                    <td>

                      <div className="admin-doctor-info">

                        <div className="admin-doctor-avatar">

                          {doctor.name
                            .replace(/^Dr\.\s*/i, "")
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}

                        </div>

                        <div>

                          <strong>
                            {doctor.name}
                          </strong>

                          <span>
                            {doctor.email}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>
                      {doctor.id}
                    </td>

                    <td>
                      {doctor.specialization}
                    </td>

                    <td>
                      {doctor.department}
                    </td>

                    <td>
                      {doctor.experience}
                    </td>

                    <td>

                      <span
                        className={`admin-doctor-status ${doctor.status.toLowerCase()}`}
                      >
                        {doctor.status}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`admin-doctor-access ${doctor.access.toLowerCase()}`}
                      >
                        {doctor.access}
                      </span>

                    </td>

                    <td>

                      <div className="admin-doctor-actions">

                        <button
                          className="manage-doctor-btn"
                          onClick={() =>
                            handleManageDoctor(doctor)
                          }
                        >
                          Manage
                        </button>

                        <button
                          className="doctor-credential-btn"
                          onClick={() =>
                            handleViewCredentials(doctor)
                          }
                        >
                          Login
                        </button>

                        <button
                          className={
                            doctor.status === "Active"
                              ? "doctor-disable-btn"
                              : "doctor-enable-btn"
                          }
                          onClick={() =>
                            handleStatusChange(doctor)
                          }
                        >
                          {doctor.status === "Active"
                            ? "Disable"
                            : "Enable"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </section>

      {/* ADD DOCTOR MODAL */}

      {showAddDoctor && (

        <div className="admin-doctor-modal-overlay">

          <div className="admin-doctor-modal">

            <button
              className="admin-doctor-modal-close"
              onClick={closeAllModals}
            >
              ×
            </button>

            <span className="admin-modal-label">
              DOCTOR MANAGEMENT
            </span>

            <h2>Add New Doctor</h2>

            <p>
              Enter the doctor's information to create a
              new hospital account.
            </p>

            {error && (
              <div className="admin-doctor-error">
                {error}
              </div>
            )}

            <form onSubmit={handleAddDoctor}>

              <div className="admin-doctor-form-grid">

                <div className="admin-doctor-form-group">
                  <label>Full Name</label>

                  <input
                    name="name"
                    value={doctorForm.name}
                    onChange={handleAddDoctorChange}
                    placeholder="Dr. Full Name"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={doctorForm.email}
                    onChange={handleAddDoctorChange}
                    placeholder="doctor@medicare.com"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={doctorForm.phone}
                    onChange={handleAddDoctorChange}
                    placeholder="10 digit mobile number"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={doctorForm.gender}
                    onChange={handleAddDoctorChange}
                    required
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="admin-doctor-form-group">
                  <label>Qualification</label>

                  <input
                    name="qualification"
                    value={doctorForm.qualification}
                    onChange={handleAddDoctorChange}
                    placeholder="MBBS, MD"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Specialization</label>

                  <input
                    name="specialization"
                    value={doctorForm.specialization}
                    onChange={handleAddDoctorChange}
                    placeholder="Cardiology"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={doctorForm.department}
                    onChange={handleAddDoctorChange}
                    required
                    disabled={loadingDepartments}
                  >
                    <option value="">
                      {loadingDepartments
                        ? "Loading Departments..."
                        : "Select Department"}
                    </option>

                    {departments.map((department) => (
                      <option
                        key={department._id}
                        value={department.name}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-doctor-form-group">
                  <label>Experience</label>

                  <input
                    name="experience"
                    value={doctorForm.experience}
                    onChange={handleAddDoctorChange}
                    placeholder="5 Years"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Consultation Fee</label>

                  <input
                    type="number"
                    name="consultationFee"
                    value={doctorForm.consultationFee}
                    onChange={handleAddDoctorChange}
                    placeholder="500"
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={doctorForm.status}
                    onChange={handleAddDoctorChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

              </div>

              <div className="admin-doctor-modal-actions">

                <button
                  type="button"
                  className="admin-doctor-cancel-btn"
                  onClick={closeAllModals}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-doctor-save-btn"
                  disabled={creatingDoctor}
                >
                  {creatingDoctor
                    ? "Creating Doctor..."
                    : "Create Doctor"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* MANAGE DOCTOR MODAL */}

      {showManageDoctor && selectedDoctor && (

        <div className="admin-doctor-modal-overlay">

          <div className="admin-doctor-modal">

            <button
              className="admin-doctor-modal-close"
              onClick={closeAllModals}
            >
              ×
            </button>

            <span className="admin-modal-label">
              DOCTOR PROFILE
            </span>

            <h2>Manage Doctor</h2>

            <p>
              Update the doctor's profile and account
              information.
            </p>

            {error && (
              <div className="admin-doctor-error">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateDoctor}>

              <div className="admin-doctor-form-grid">

                <div className="admin-doctor-form-group">
                  <label>Doctor ID</label>

                  <input
                    value={selectedDoctor.id}
                    disabled
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Full Name</label>

                  <input
                    name="name"
                    value={doctorForm.name}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={doctorForm.email}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={doctorForm.phone}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={doctorForm.gender}
                    onChange={handleEditDoctorChange}
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="admin-doctor-form-group">
                  <label>Qualification</label>

                  <input
                    name="qualification"
                    value={doctorForm.qualification}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Specialization</label>

                  <input
                    name="specialization"
                    value={doctorForm.specialization}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={doctorForm.department}
                    onChange={handleEditDoctorChange}
                    required
                    disabled={loadingDepartments}
                  >
                    <option value="">
                      {loadingDepartments
                        ? "Loading Departments..."
                        : "Select Department"}
                    </option>

                    {departments.map((department) => (
                      <option
                        key={department._id}
                        value={department.name}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-doctor-form-group">
                  <label>Experience</label>

                  <input
                    name="experience"
                    value={doctorForm.experience}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Consultation Fee</label>

                  <input
                    type="number"
                    name="consultationFee"
                    value={doctorForm.consultationFee}
                    onChange={handleEditDoctorChange}
                    required
                  />
                </div>

                <div className="admin-doctor-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={doctorForm.status}
                    onChange={handleEditDoctorChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

              </div>

              <div className="admin-doctor-modal-actions">

                <button
                  type="button"
                  className="admin-doctor-cancel-btn"
                  onClick={closeAllModals}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-doctor-save-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* LOGIN CREDENTIALS MODAL */}

      {showCredentials && (

        <div className="admin-doctor-modal-overlay">

          <div className="admin-doctor-credentials-modal">

            <button
              className="admin-doctor-modal-close"
              onClick={closeAllModals}
            >
              ×
            </button>

            <div className="credentials-lock-icon">
              🔐
            </div>

            <span className="admin-modal-label">
              DOCTOR ACCOUNT
            </span>

            <h2>Login Credentials</h2>

            <p>
              Use these credentials for the doctor's
              MediCare account.
            </p>

            {selectedDoctor && (

              <div className="credentials-doctor-info">

                <strong>
                  {selectedDoctor.name}
                </strong>

                <span>
                  {selectedDoctor.specialization}
                </span>

              </div>

            )}

            <div className="credentials-field">

              <label>
                Email Address
              </label>

              <div>
                {credentials.email}
              </div>

            </div>

            <div className="credentials-field">

              <label>
                Temporary Password
              </label>

              <div className="credentials-password">
                {credentials.password}
              </div>

            </div>

            <div className="credentials-warning">
              ⚠️ The temporary password is shown only
              when the doctor account is created. The
              password is securely hashed in the backend
              and cannot be retrieved later.
            </div>

            <div className="credentials-actions">

              <button
                className="credentials-copy-btn"
                onClick={handleCopyCredentials}
              >
                Copy Credentials
              </button>

              <button
                className="credentials-done-btn"
                onClick={closeAllModals}
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDoctors;