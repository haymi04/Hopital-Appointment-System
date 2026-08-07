import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";

function DashboardLayout({ user, onLogout }) {
  // Get user initials for avatar
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">+</div>
          <div>
            <h2>TIBEB</h2>
            <span>HOSPITAL</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/patient/dashboard" className="sidebar-link">
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/patient/book" className="sidebar-link">
            <span>📅</span> Book Appointment
          </NavLink>
          <NavLink to="/patient/history" className="sidebar-link">
            <span>📜</span> Appointment History
          </NavLink>
          <NavLink to="/doctors" className="sidebar-link">
            <span>🔍</span> Search Doctors
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="user-welcome">
            <h1>Welcome, {user?.first_name} {user?.last_name} 👋</h1>
            <p>Here's your appointment overview</p>
          </div>
          <div className="user-profile-badge">
            <div className="avatar">{initials}</div>
          </div>
        </header>

        {/* This renders the active dashboard page */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;