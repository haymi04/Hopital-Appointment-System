import { useLocation, useNavigate } from "react-router-dom";

import "../styles/Patient/Sidebar.css";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="patient-sidebar">

      <div className="patient-logo">
        <div className="patient-logo-icon">✚</div>

        <div>
          <strong>TIBEB</strong>
          <small>HOSPITAL</small>
        </div>
      </div>

      <nav className="patient-nav">

        <button
          className={
            isActive("/patient/dashboard")
              ? "patient-nav-button patient-active"
              : "patient-nav-button"
          }
          onClick={() => navigate("/patient/dashboard")}
        >
          ▣ Dashboard
        </button>

        <button
          className={
            isActive("/patient/book")
              ? "patient-nav-button patient-active"
              : "patient-nav-button"
          }
          onClick={() => navigate("/patient/book")}
        >
          📅 Book Appointment
        </button>

        <button
          className={
            isActive("/patient/history")
              ? "patient-nav-button patient-active"
              : "patient-nav-button"
          }
          onClick={() => navigate("/patient/history")}
        >
          📋 My Appointments
        </button>

        <button
          className={
            isActive("/patient/doctors")
              ? "patient-nav-button patient-active"
              : "patient-nav-button"
          }
          onClick={() => navigate("/patient/doctors")}
        >
          👨‍⚕️ Search Doctors
        </button>

        <button
          className={
            isActive("/patient/profile")
              ? "patient-nav-button patient-active"
              : "patient-nav-button"
          }
          onClick={() => navigate("/patient/profile")}
        >
          👤 Profile
        </button>

      </nav>

      <button
        className="patient-logout"
        onClick={onLogout}
      >
        ↪ Logout
      </button>

    </aside>
  );
}

export default Sidebar;