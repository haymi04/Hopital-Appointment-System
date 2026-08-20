import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading statistics...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>Total Doctors</h3>
          <p style={{ fontSize: "2.5rem", margin: 0, fontWeight: "bold", color: "#111827" }}>{stats.doctors}</p>
        </div>

        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>Total Patients</h3>
          <p style={{ fontSize: "2.5rem", margin: 0, fontWeight: "bold", color: "#111827" }}>{stats.patients}</p>
        </div>

        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>Appointments</h3>
          <p style={{ fontSize: "2.5rem", margin: 0, fontWeight: "bold", color: "#3b82f6" }}>{stats.appointments}</p>
        </div>

        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>Departments</h3>
          <p style={{ fontSize: "2.5rem", margin: 0, fontWeight: "bold", color: "#10b981" }}>{stats.departments}</p>
        </div>

      </div>
    </div>
  );
}