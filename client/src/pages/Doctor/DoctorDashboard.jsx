import React from "react";

function DoctorDashboard({ user }) {
  return (
    <div className="dashboard-content">

      {/* Welcome Section */}
      <div className="dashboard-page-header">
        <div>
          <h2>Welcome, Dr. {user?.first_name || "Doctor"} 👋</h2>
          <p>Here is an overview of your appointments and schedule.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <h3>0</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div>
            <h3>0</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <h3>0</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div>
            <h3>0</h3>
            <p>Available Slots</p>
          </div>
        </div>

      </div>

      {/* Today's Appointments */}
      <div className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Today's Appointments</h2>
            <p>Your scheduled appointments for today</p>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No appointments today</h3>
          <p>You don't have any appointments scheduled for today.</p>
        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;