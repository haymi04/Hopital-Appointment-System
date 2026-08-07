import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Section 1: Account Information (Required)
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "Male",
    date_of_birth: "",
    password: "",
    confirm_password: "",
    role: "PATIENT", // Hardcoded implicitly

    // Section 2: Patient Details (Optional)
    blood_group: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    // Client-side Password Match Check
    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match!");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We send the full payload to the backend
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful! Redirecting to login...");
      setIsError(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-mode">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">+</div>
            <div>
              <h2 style={{ fontSize: "20px", color: "#123d83" }}>TIBEB</h2>
              <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#456", fontWeight: "600" }}>HOSPITAL</span>
            </div>
          </div>
          <h2>Create Account</h2>
          <p>Register to start booking appointments</p>
        </div>

        {message && (
          <div className={`alert-message ${isError ? "error" : "success"}`} style={{ marginBottom: "20px" }}>
            {message}
          </div>
        )}

               <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Section 1: Account Information Header Banner */}
            <div className="section-header">
              <h3>Section 1: Account Information (Required)</h3>
            </div>

            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+251 912 345 678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                required
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Choose a strong password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                required
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
              />
            </div>


             {/* Section 2: Patient Details Header Banner */}
            <div className="section-header">
              <h3>Section 2: Patient Details (Optional)</h3>
            </div>

            <div className="form-group">
              <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
              <input
                type="text"
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
              <input
                type="tel"
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="blood_group">Blood Group</label>
              <select id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleInputChange}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Street Name, City"
              />
            </div>

          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;