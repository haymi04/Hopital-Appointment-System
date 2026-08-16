import "../style/Sidebar.css";

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">✚</div>

        <div>
          <strong>TIBEB</strong>
          <small>HOSPITAL</small>
        </div>
      </div>

      <nav>
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          ▣ Dashboard
        </button>

        <button
          className={page === "book" ? "active" : ""}
          onClick={() => setPage("book")}
        >
          📅 Book Appointment
        </button>

        <button
          className={page === "history" ? "active" : ""}
          onClick={() => setPage("history")}
        >
          📋 My Appointments
        </button>

        <button
          className={page === "doctors" ? "active" : ""}
          onClick={() => setPage("doctors")}
        >
          👨‍⚕️ Search Doctors
        </button>

        <button
          className={page === "profile" ? "active" : ""}
          onClick={() => setPage("profile")}
        >
          👤 Profile
        </button>
      </nav>

      <button className="logout">
        ↪ Logout
      </button>
    </aside>
  );
}

export default Sidebar;