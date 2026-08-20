import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout"; // Import the new AdminLayout
import DoctorLayout from "./components/DoctorLayout"; // Import the new DoctorLayout
import PatientLayout from "./components/PatientLayout";
import "./App.css";

//PUBLIC PAGES
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import Register from "./pages/Register";

//PATIENT PAGES
import PatientDashboard from "./pages/Patient/PatientDashboard";
import BookAppointment from "./pages/Patient/BookAppointment";
import AppointmentHistory from "./pages/Patient/AppointmentHistory";
import SearchDoctors from "./pages/Patient/SearchDoctors";
import Profile from "./pages/Patient/Profile";

//DOCTOR PAGES
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorAvailability from "./pages/Doctor/DoctorAvailability";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const API = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  // Patient data
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

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
  //Api functions appointments and doctors to be solved later from this point
 const getAppointments = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API}/appointments`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.appointments || [];

    setAppointments(data);

  } catch (error) {
    console.error("Error loading appointments:", error);
  }
};

const getDoctors = async () => {
  try {
    const response = await axios.get(
      `${API}/doctors`
    );

    setDoctors(response.data);
  } catch (error) {
    console.error(
      "Error loading doctors:",
      error
    );
  }
};
useEffect(() => {
  if (user?.role === "PATIENT") {
    getAppointments();
    getDoctors();
  }
}, [user]);
const bookAppointment = async (e) => {
  e.preventDefault();

console.log("Logged in user:", user);

  if (
    !doctor ||
    !date ||
    !appointmentTime ||
    !reason
  ) {
    alert(
      "Please select doctor, date, time and enter a reason."
    );
    return;
  }

  try {
   const token = localStorage.getItem("token");

await axios.post(
  `${API}/appointments`,
  {
    
    doctor_id: Number(doctor),
    
    appointment_date: date,
    appointment_time: appointmentTime,
    reason: reason,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    alert("Appointment booked successfully!");

    setDoctor("");
    setDate("");
    setAppointmentTime("");
    setReason("");

    await getAppointments();
  } catch (error) {
    console.error("Booking error:", error);

    alert(
      error.response?.data?.message ||
        "Could not book appointment. Check the backend."
    );
  }
};

const cancelAppointment = async (id) => {
  try {
    const token = localStorage.getItem("token");

await axios.put(
  `${API}/appointments/${id}`,
  {
    status: "CANCELLED",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    await getAppointments();
  } catch (error) {
    console.error(
      "Cancel error:",
      error
    );

    alert(
      "Could not cancel appointment."
    );
  }
};
//till this point

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
      <PatientLayout user={user} onLogout={handleLogout} />
    ) : (
      <Navigate
        to="/login"
        state={{ from: "/patient/book" }}
        replace
      />
    )
  }
>
         <Route
        path="dashboard"
        element={
          <PatientDashboard
            user={user}
            appointments={appointments}
            doctors={doctors}
            cancelAppointment={cancelAppointment}
          />
        }
      />
         <Route
    path="book"
    element={
      <BookAppointment
        doctors={doctors}
        doctor={doctor}
        setDoctor={setDoctor}
        date={date}
        setDate={setDate}
        appointmentTime={appointmentTime}
        setAppointmentTime={setAppointmentTime}
        reason={reason}
        setReason={setReason}
        bookAppointment={bookAppointment}
      />
    }
  />
        <Route
    path="history"
    element={
      <AppointmentHistory
        appointments={appointments}
        doctors={doctors}
        cancelAppointment={cancelAppointment}
      />
    }
  />

        <Route
    path="doctors"
    element={
      <SearchDoctors
        doctors={doctors}
        setDoctor={setDoctor}
      />
    }
  />
       <Route
    path="profile"
    element={
      <Profile user={user} />
    }
  />
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