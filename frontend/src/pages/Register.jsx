import "./Register.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    /* CHECK PASSWORD */

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* CHECK PASSWORD LENGTH */

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/patients/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setMessage(
        `Account created successfully! Your Patient ID is ${data.patient.patientId}.`
      );

      /* CLEAR FORM */

      setFormData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="register-page">

      <section className="register-section">

        <div className="register-card">

          {/* Form Header */}

          <div className="form-heading">

            <span className="form-label">
              PATIENT ACCOUNT
            </span>

            <h1>
              Create your patient account
            </h1>

            <p>
              Register to book appointments and manage your healthcare
              information securely.
            </p>

          </div>

          {/* Registration Form */}

          <form onSubmit={handleSubmit}>

            <div className="form-group full-width">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group full-width">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

            {/* Success Message */}

            {message && (
              <div
                style={{
                  color: "#168b87",
                  background: "#eaf8f7",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  marginBottom: "15px"
                }}
              >
                {message}
              </div>
            )}

            {/* Error Message */}

            {error && (
              <div
                style={{
                  color: "#c62828",
                  background: "#fdecec",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  marginBottom: "15px"
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>

          {/* Login */}

          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;