import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout"; // Import the new AdminLayout
import DoctorLayout from "./components/DoctorLayout"; // Import the new DoctorLayout

import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorAvailability from "./pages/Doctor/DoctorAvailability";
import DoctorProfile from "./pages/Doctor/DoctorProfile";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0b0f19", color: "#9ca3af" }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Top Navbar) */}
      <Route element={<PublicLayout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors user={user} />} />
        <Route path="/departments" element={<Departments user={user} />} />

      {/* AUTH ROUTES */}
      <Route
        path="/login"
        element={
         user ? (
            user.role === "ADMIN" ? (
              <Navigate to="/admin/doctors" replace />
            ) : user.role === "DOCTOR" ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : (
              <Navigate to="/patient/dashboard" replace />
            )
          ): (
            <Login onAuthSuccess={handleAuthSuccess} />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            user.role === "ADMIN" ? (
              <Navigate to="/admin/doctors" replace />
            ) : (
              <Navigate to="/patient/dashboard" replace />
            )
          ) : (
            <Register />
          )
        }
      />
         </Route> //Closed the public layout

      {/* 2. PATIENT ROUTES (Patient Sidebar) */}
      <Route
        path="/patient"
        element={
          user && user.role === "PATIENT" ? (
            <DashboardLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<PatientDashboard user={user} />} />
         <Route path="book" element={<div>Book Appointment Page</div>} />
        <Route path="history" element={<div>Appointment History Page</div>} />
        <Route path="doctors" element={<Doctors user={user} />} />
      </Route>


      {/* 3. ADMIN ROUTES (Admin Sidebar - Kal's Doctor Management) */}
      <Route
        path="/admin"
        element={
          user && user.role === "ADMIN" ? (
            <AdminLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
       <Route
    path="dashboard"
    element={
      <div>
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin dashboard.</p>
      </div>
    }
  />

      <Route
        path="doctors"
        element={<Doctors user={user} />}
      />

    <Route
      path="departments"
      element={<Departments user={user} />}
    />

      </Route>
     {/* 3. Doctor ROUTES (Doctor Sidebar) */}
      <Route
        path="/doctor"
        element={
          user && user.role === "DOCTOR" ? (
            <DoctorLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<DoctorDashboard user={user} />} />
        <Route path="appointments" element={<DoctorAppointments user={user} />} />
        <Route path="availability" element={<DoctorAvailability user={user} />} />
        <Route path="profile" element={<DoctorProfile user={user} />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;