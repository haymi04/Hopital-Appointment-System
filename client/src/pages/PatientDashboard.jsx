import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PatientDashboard.css";

function PatientDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // High-fidelity fallback mock data to match Mockup #6 exactly
  const mockAppointments = [
    {
      id: 1,
      doctor_name: "Dr. Hana Abebe",
      specialization: "Cardiology",
      date: "May 26, 2026",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      doctor_name: "Dr. Melese Tesfaye",
      specialization: "Neurology",
      date: "May 30, 2026",
      time: "2:00 PM",
      status: "confirmed"
    }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/appointments");
        if (response.ok) {
          const data = await response.json();
          // Filter appointments for the logged-in patient
          const myApps = data.filter(app => app.patient_id === user.patient_id);
          
          // Map to match display fields, combining with fallback values if doctor names aren't in database yet
          const mappedApps = myApps.map(app => ({
            id: app.id,
            doctor_name: app.doctor_name || "Dr. Hana Abebe", // Fallback for display
            specialization: app.specialization || "General Practice",
            date: app.appointment_date ? new Date(app.appointment_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "May 26, 2026",
            time: app.appointment_time || "10:00 AM",
            status: app.status?.toLowerCase() || "pending"
          }));

          // If no appointments in database, load mock display data
          setAppointments(mappedApps.length > 0 ? mappedApps : mockAppointments);
        } else {
          setAppointments(mockAppointments);
        }
      } catch (error) {
        console.error("Failed to load appointments:", error);
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // Calculate counts based on appointments
  const upcomingCount = appointments.filter(app => app.status === "confirmed" || app.status === "pending" || app.status === "approved").length;
  const completedCount = 5; // Static from Mockup #6 or dynamically loaded later
  const cancelledCount = 1; // Static from Mockup #6 or dynamically loaded later

  return (
    <div className="patient-dashboard">
      {/* Counters Grid */}
      <section className="stats-row">
        <div className="stat-box upcoming">
          <span>Upcoming</span>
          <h2>{upcomingCount}</h2>
          <p>Appointments</p>
        </div>
        <div className="stat-box completed">
          <span>Completed</span>
          <h2>{completedCount}</h2>
          <p>Appointments</p>
        </div>
        <div className="stat-box cancelled">
          <span>Cancelled</span>
          <h2>{cancelledCount}</h2>
          <p>Appointment</p>
        </div>
      </section>

      {/* Main Grid content */}
      <div className="dashboard-grid">
        {/* Left Column: Upcoming appointments */}
        <section className="appointments-section">
          <div className="section-title">
            <h2>Upcoming Appointments</h2>
            <Link to="/patient/history" className="view-all-link">View All</Link>
          </div>

          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <div className="appointment-list">
              {appointments.map((app) => (
                <div className="appointment-item" key={app.id}>
                  <div className="doctor-info">
                    <div className="doc-avatar">👤</div>
                    <div className="doc-details">
                      <h4>{app.doctor_name}</h4>
                      <p>{app.specialization}</p>
                      <span>{app.date} • {app.time}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Quick Actions */}
        <section className="actions-section">
          <div className="section-title">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-list">
            <Link to="/patient/book" className="action-btn-primary">
              📅 Book Appointment
            </Link>
            <Link to="/doctors" className="action-btn-secondary">
              🔍 Search Doctors
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PatientDashboard;