import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      /* =========================
         DOCTOR LOGIN
      ========================= */

      if (role === "doctor") {
        const response = await fetch(
          "http://localhost:5000/api/doctors/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Invalid doctor email or password."
          );
        }

        if (!data.doctor) {
          throw new Error("Doctor information was not returned.");
        }

        localStorage.setItem(
          "doctorData",
          JSON.stringify(data.doctor)
        );

        if (data.token) {
          localStorage.setItem("doctorToken", data.token);
        }

        localStorage.setItem(
          "rememberDoctor",
          rememberMe ? "true" : "false"
        );

        localStorage.removeItem("patientToken");
        localStorage.removeItem("patientData");
        localStorage.removeItem("rememberPatient");

        navigate("/doctor-dashboard");

        return;
      }

      /* =========================
         PATIENT LOGIN
      ========================= */

      const response = await fetch(
        "http://localhost:5000/api/patients/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid patient email or password."
        );
      }

      const patient =
        data.patient ||
        data.user ||
        null;

      if (!patient) {
        throw new Error("Patient information was not returned.");
      }

      const patientId =
        patient.patientId ||
        patient.id ||
        patient._id ||
        "";

      if (!patientId) {
        throw new Error("Patient ID was not returned.");
      }

      const patientData = {
        ...patient,
        patientId,
      };

      localStorage.setItem(
        "patientData",
        JSON.stringify(patientData)
      );

      if (data.token) {
        localStorage.setItem("patientToken", data.token);
      } else {
        localStorage.setItem("patientToken", "patient-session");
      }

      localStorage.setItem(
        "rememberPatient",
        rememberMe ? "true" : "false"
      );

      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctorData");
      localStorage.removeItem("rememberDoctor");

      navigate("/patient-dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("Password reset will be available soon.");
  };

  return (
    <div className="login-page">

      <section className="login-section">

        <div className="login-card">

          {/* Heading */}

          <div className="login-heading">

            <span className="login-label">
              SECURE ACCESS
            </span>

            <h1>Welcome Back</h1>

            <p>
              Sign in to continue to your MediCare account.
            </p>

          </div>


          {/* Role Selection */}

          <div className="login-role-section">

            <label>Login As</label>

            <div className="login-role-options">

              <button
                type="button"
                className={`role-option ${
                  role === "patient" ? "active" : ""
                }`}
                onClick={() => {
                  setRole("patient");
                  setError("");
                }}
              >

                <span>👤</span>

                <div>
                  <strong>Patient</strong>
                  <small>Patient account</small>
                </div>

              </button>


              <button
                type="button"
                className={`role-option ${
                  role === "doctor" ? "active" : ""
                }`}
                onClick={() => {
                  setRole("doctor");
                  setError("");
                }}
              >

                <span>👨‍⚕️</span>

                <div>
                  <strong>Doctor</strong>
                  <small>Doctor account</small>
                </div>

              </button>

            </div>

          </div>


          {/* Login Form */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Email */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                autoComplete="email"
              />

            </div>


            {/* Password */}

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

            </div>


            {/* Remember / Forgot */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>Remember me</span>

              </label>


              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>

            </div>


            {/* Error */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* Login Button */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>


          {/* Register */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;
