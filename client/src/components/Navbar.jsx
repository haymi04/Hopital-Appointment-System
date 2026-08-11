import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">+</div>

        <div>
          <h2>TIBEB</h2>
          <span>HOSPITAL</span>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/departments">Departments</Link>
        {user && user.role === "PATIENT" && (
          <Link to="/patient/dashboard">Dashboard</Link>
        )}
      </div>

      <div className="nav-buttons">
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              Hi, <strong>{user.first_name}</strong> ({user.role})
            </span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/register">
              <button className="register-btn">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;