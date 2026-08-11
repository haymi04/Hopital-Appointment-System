import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css"; // Reuse your existing sidebar styles

function AdminLayout({ user, onLogout }) {
  const initials = `${user?.first_name?.[0] || "A"}${user?.last_name?.[0] || "M"}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Admin Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">+</div>
          <div>
            <h2>TIBEB</h2>
            <span>HOSPITAL</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/admin/dashboard" className="sidebar-link">
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/doctors" className="sidebar-link">
            <span>👨‍⚕️</span> Manage Doctors
          </NavLink>
          <NavLink to="/admin/departments" className="sidebar-link">
            <span>🏥</span> Departments
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
            <h1>Admin Panel 🛡️</h1>
            <p>Overview & Hospital Management</p>
          </div>
          <div className="user-profile-badge">
            <div className="avatar">{initials}</div>
          </div>
        </header>

        {/* Renders /admin/doctors or /admin/dashboard */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;