import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css"; // Reuse your existing sidebar styles

function DoctorLayout({ user, onLogout }) {
  const initials = `${user?.first_name?.[0] || "D"}${user?.last_name?.[0] || "R"}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Doctor Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">+</div>
          <div>
            <h2>TIBEB</h2>
            <span>HOSPITAL</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/doctor/dashboard" className="sidebar-link">
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/doctor/appointments" className="sidebar-link">
            <span>📅</span> Appointments
          </NavLink>
          <NavLink to="/doctor/availability" className="sidebar-link">
            <span>🕐</span> Availability
          </NavLink>
          <NavLink to="/doctor/profile" className="sidebar-link">
            <span>🧑‍🤝‍🧑</span> Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="user-welcome">
            <h1>Doctor Panel 🩺</h1>
            <p>Manage your appointments and availability</p>
          </div>
          <div className="user-profile-badge">
            <div className="avatar">{initials}</div>
          </div>
        </header>

        {/* Renders /doctor/appointments or /doctor/dashboard */}
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorLayout;