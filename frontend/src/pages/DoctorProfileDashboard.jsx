import { useEffect, useState } from "react";
import "./DoctorProfileDashboard.css";

function DoctorProfileDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState({
    doctorId: "",
    name: "",
    specialization: "",
    experience: "",
    qualification: "",
    department: "",
    email: "",
    phone: "",
    consultationFee: "",
    status: "",
    accountAccess: "",
    registrationNo: "Not added",
    hospital: "MediCare Hospital",
    location: "Pune, Maharashtra",
    duration: "30 Minutes",
    workingDays: "Monday – Friday",
    workingHours: "09:00 AM – 05:00 PM",
  });

  const [editProfile, setEditProfile] = useState(profile);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("doctorToken");
      const storedDoctorData =
        localStorage.getItem("doctorData");

      if (!token || !storedDoctorData) {
        window.location.href = "/login";
        return;
      }

      const storedDoctor =
        JSON.parse(storedDoctorData);

      if (!storedDoctor?.doctorId) {
        setError("Doctor information not found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/doctors/${storedDoctor.doctorId}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load doctor profile."
        );
        return;
      }

      const doctor = data;

      const doctorProfile = {
        doctorId: doctor.doctorId || "",
        name: doctor.name || "",
        specialization:
          doctor.specialization || "",
        experience: doctor.experience || "",
        qualification:
          doctor.qualification || "",
        department: doctor.department || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        consultationFee:
          doctor.consultationFee !== undefined
            ? `₹${doctor.consultationFee}`
            : "",
        status: doctor.status || "",
        accountAccess:
          doctor.accountAccess || "",
        registrationNo: "Not added",
        hospital: "MediCare Hospital",
        location: "Pune, Maharashtra",
        duration: "30 Minutes",
        workingDays: "Monday – Friday",
        workingHours: "09:00 AM – 05:00 PM",
      };

      setProfile(doctorProfile);
      setEditProfile(doctorProfile);
    } catch (error) {
      console.error(
        "Fetch doctor profile error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the MediCare backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) {
      return "DR";
    }

    const nameParts = name
      .replace(/^Dr\.\s*/i, "")
      .trim()
      .split(" ")
      .filter(Boolean);

    if (nameParts.length === 1) {
      return nameParts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      nameParts[0][0] +
      nameParts[nameParts.length - 1][0]
    ).toUpperCase();
  };

  const handleEdit = () => {
    setSuccessMessage("");
    setError("");
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("doctorToken");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const consultationFee = Number(
        String(editProfile.consultationFee)
          .replace("₹", "")
          .trim()
      );

      const response = await fetch(
        `http://localhost:5000/api/doctors/${editProfile.doctorId}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editProfile.name,
            phone: editProfile.phone,
            qualification:
              editProfile.qualification,
            specialization:
              editProfile.specialization,
            department: editProfile.department,
            experience: editProfile.experience,
            consultationFee,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update doctor profile."
        );
        return;
      }

      const doctor = data;

      const updatedProfile = {
        ...editProfile,
        doctorId:
          doctor.doctorId ||
          editProfile.doctorId,
        name:
          doctor.name ||
          editProfile.name,
        specialization:
          doctor.specialization ||
          editProfile.specialization,
        experience:
          doctor.experience ||
          editProfile.experience,
        qualification:
          doctor.qualification ||
          editProfile.qualification,
        department:
          doctor.department ||
          editProfile.department,
        email:
          doctor.email ||
          editProfile.email,
        phone:
          doctor.phone ||
          editProfile.phone,
        consultationFee:
          doctor.consultationFee !== undefined
            ? `₹${doctor.consultationFee}`
            : editProfile.consultationFee,
        status:
          doctor.status ||
          editProfile.status,
        accountAccess:
          doctor.accountAccess ||
          editProfile.accountAccess,
      };

      setProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setIsEditing(false);

      setSuccessMessage(
        "Profile updated successfully."
      );

      const storedDoctorData =
        localStorage.getItem("doctorData");

      if (storedDoctorData) {
        const storedDoctor =
          JSON.parse(storedDoctorData);

        const updatedStoredDoctor = {
          ...storedDoctor,
          doctorId: doctor.doctorId,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          qualification:
            doctor.qualification,
          specialization:
            doctor.specialization,
          department: doctor.department,
          experience: doctor.experience,
          consultationFee:
            doctor.consultationFee,
          status: doctor.status,
          accountAccess:
            doctor.accountAccess,
        };

        localStorage.setItem(
          "doctorData",
          JSON.stringify(
            updatedStoredDoctor
          )
        );
      }
    } catch (error) {
      console.error(
        "Update doctor profile error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the MediCare backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="doctor-profile-dashboard-page">
        <div className="doctor-profile-loading">
          Loading doctor profile...
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="doctor-profile-dashboard-page">
        <div className="doctor-profile-error">
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>

          <button
            type="button"
            className="doctor-profile-edit-btn"
            onClick={fetchDoctorProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-dashboard-page">

      <header className="doctor-profile-dashboard-header">
        <div>
          <span>DOCTOR PROFILE</span>

          <h1>My Profile</h1>

          <p>
            View and manage your professional
            information and account details.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="doctor-profile-edit-btn"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        ) : (
          <div className="doctor-profile-header-actions">
            <button
              type="button"
              className="doctor-profile-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="doctor-profile-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        )}
      </header>

      {successMessage && (
        <div className="doctor-profile-success">
          {successMessage}
        </div>
      )}

      {error && isEditing && (
        <div className="doctor-profile-error-message">
          {error}
        </div>
      )}

      <section className="doctor-profile-overview-card">
        <div className="doctor-profile-main">

          <div className="doctor-profile-large-avatar">
            {getInitials(
              isEditing
                ? editProfile.name
                : profile.name
            )}
          </div>

          <div className="doctor-profile-main-info">
            <h2>
              {isEditing
                ? editProfile.name
                : profile.name}
            </h2>

            <span>
              {isEditing
                ? editProfile.specialization
                : profile.specialization}
            </span>

            <p>
              {profile.hospital} ·{" "}
              {profile.location.split(",")[0]}
            </p>
          </div>
        </div>

        <div className="doctor-profile-status">
          <span className="doctor-profile-status-dot"></span>
          {profile.status || "Active"}
        </div>
      </section>

      <section className="doctor-profile-card">
        <div className="doctor-profile-card-heading">
          <div>
            <span>
              PROFESSIONAL INFORMATION
            </span>
            <h2>Professional Details</h2>
          </div>
        </div>

        <div className="doctor-profile-details-grid">

          <ProfileField
            label="Doctor ID"
            name="doctorId"
            value={editProfile.doctorId}
            isEditing={false}
            onChange={handleChange}
          />

          <ProfileField
            label="Full Name"
            name="name"
            value={editProfile.name}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Specialization"
            name="specialization"
            value={editProfile.specialization}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Experience"
            name="experience"
            value={editProfile.experience}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Qualification"
            name="qualification"
            value={editProfile.qualification}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Department"
            name="department"
            value={editProfile.department}
            isEditing={isEditing}
            onChange={handleChange}
          />

        </div>
      </section>

      <section className="doctor-profile-card">
        <div className="doctor-profile-card-heading">
          <div>
            <span>
              CONTACT INFORMATION
            </span>
            <h2>Contact Details</h2>
          </div>
        </div>

        <div className="doctor-profile-details-grid">

          <ProfileField
            label="Email Address"
            name="email"
            value={editProfile.email}
            isEditing={false}
            onChange={handleChange}
          />

          <ProfileField
            label="Phone Number"
            name="phone"
            value={editProfile.phone}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Hospital"
            name="hospital"
            value={editProfile.hospital}
            isEditing={false}
            onChange={handleChange}
          />

          <ProfileField
            label="Location"
            name="location"
            value={editProfile.location}
            isEditing={false}
            onChange={handleChange}
          />

        </div>
      </section>

      <section className="doctor-profile-card">
        <div className="doctor-profile-card-heading">
          <div>
            <span>
              CONSULTATION INFORMATION
            </span>
            <h2>Practice Details</h2>
          </div>
        </div>

        <div className="doctor-profile-details-grid">

          <ProfileField
            label="Consultation Fee"
            name="consultationFee"
            value={editProfile.consultationFee}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ProfileField
            label="Consultation Duration"
            name="duration"
            value={editProfile.duration}
            isEditing={false}
            onChange={handleChange}
          />

          <ProfileField
            label="Working Days"
            name="workingDays"
            value={editProfile.workingDays}
            isEditing={false}
            onChange={handleChange}
          />

          <ProfileField
            label="Working Hours"
            name="workingHours"
            value={editProfile.workingHours}
            isEditing={false}
            onChange={handleChange}
          />

        </div>
      </section>

      <section className="doctor-profile-card doctor-account-card">
        <div className="doctor-profile-card-heading">
          <div>
            <span>
              ACCOUNT SETTINGS
            </span>
            <h2>Account Information</h2>
          </div>
        </div>

        <div className="doctor-profile-account-row">
          <div>
            <strong>Account Status</strong>

            <span>
              Your doctor account is currently{" "}
              {profile.accountAccess === "Enabled"
                ? "active and enabled."
                : "disabled."}
            </span>
          </div>

          <span className="doctor-profile-active-badge">
            {profile.status || "Active"}
          </span>
        </div>

        <div className="doctor-profile-account-row">
          <div>
            <strong>Doctor ID</strong>
            <span>
              {profile.doctorId}
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}

function ProfileField({
  label,
  name,
  value,
  isEditing,
  onChange,
}) {
  return (
    <div className="doctor-profile-detail">
      <span>{label}</span>

      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="doctor-profile-input"
        />
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

export default DoctorProfileDashboard;