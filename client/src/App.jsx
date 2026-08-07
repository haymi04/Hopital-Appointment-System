// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import DoctorList from './components/DoctorList';
import './App.css';
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard sub-page (only loading PatientDashboard)
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (has token)
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setUser(data.user);
          } else {
            // Token expired or invalid
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
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b0f19",
          color: "#9ca3af",
        }}
      >
        Loading...
      </div>
    );
  }

  // Temporary dashboard for other roles (DOCTOR, ADMIN, RECEPTIONIST)
  if (user && user.role !== "PATIENT") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b0f19",
          color: "#f3f4f6",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>Hospital Appointment System</h1>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          Welcome back, <strong>{user.first_name} {user.last_name}</strong>! You are logged in as a <strong>{user.role}</strong>.
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public pages wrapped in PublicLayout (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        {/* If logged in as patient, redirect "/" to patient dashboard, otherwise show LandingPage */}
        <Route
          path="/"
          element={
            user && user.role === "PATIENT" ? (
              <Navigate to="/patient/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/departments" element={<Departments />} />
      </Route>

      {/* Authentication pages (redirects to dashboard if already logged in) */}
      <Route
        path="/login"
        element={
          user && user.role === "PATIENT" ? (
            <Navigate to="/patient/dashboard" replace />
          ) : (
            <Login onAuthSuccess={handleAuthSuccess} />
          )
        }
      />
      <Route
        path="/register"
        element={
          user && user.role === "PATIENT" ? (
            <Navigate to="/patient/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Patient Dashboard Layout (Protected: redirects to login if not logged in) */}
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
        {/* Only routing to patient dashboard */}
        <Route path="dashboard" element={<PatientDashboard user={user} />} />
      </Route>

      {/* Fallback route: redirects undefined pages back to landing or dashboard */}
      <Route
        path="*"
        element={
          user && user.role === "PATIENT" ? (
            <Navigate to="/patient/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;