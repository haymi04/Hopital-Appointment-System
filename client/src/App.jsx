import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import Sidebar from "./components/Sidebar";


import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import AppointmentHistory from "./pages/AppointmentHistory";
import SearchDoctors from "./pages/SearchDoctors";
import Profile from "./pages/Profile";

const API = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState("dashboard");

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  
  // Temporary until authentication is connected
  const patientId = 1;

  // =========================
  // GET APPOINTMENTS
  // =========================

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${API}/appointments`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.appointments || [];

      setAppointments(data);
    } catch (error) {
      console.error(
        "Error loading appointments:",
        error
      );
    }
  };

  // =========================
  // GET DOCTORS
  // =========================

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

  // =========================
  // INITIAL DATA
  // =========================

  useEffect(() => {
    getAppointments();
    getDoctors();
  }, []);

  // =========================
  // BOOK APPOINTMENT
  // =========================

  const bookAppointment = async (e) => {
    e.preventDefault();

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
      await axios.post(`${API}/appointments`, {
        patient_id: patientId,
        doctor_id: Number(doctor),
        created_by_user_id: patientId,
        appointment_date: date,
        appointment_time: appointmentTime,
        
        reason: reason,
      });

      alert("Appointment booked successfully!");

      setDoctor("");
      setDate("");
      setAppointmentTime("");
      setReason("");

      await getAppointments();

      setPage("history");
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Could not book appointment. Check the backend."
      );
    }
  };

  // =========================
  // CANCEL APPOINTMENT
  // =========================

  const cancelAppointment = async (id) => {
    try {
      await axios.put(
        `${API}/appointments/${id}`,
        {
          status: "CANCELLED",
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

  // =========================
  // PAGE RENDERING
  // =========================

  return (
    <div className="app">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="main">

        {page === "dashboard" && (
          <Dashboard
            appointments={appointments}
            doctors={doctors}
            setPage={setPage}
            cancelAppointment={cancelAppointment}
          />
        )}

        {page === "book" && (
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
        )}

        {page === "history" && (
          <AppointmentHistory
            appointments={appointments}
            doctors={doctors}
            cancelAppointment={cancelAppointment}
          />
        )}

        {page === "doctors" && (
          <SearchDoctors
            doctors={doctors}
            setDoctor={setDoctor}
            setPage={setPage}
          />
        )}

        {page === "profile" && (
  <Profile user={null} />
)}

      </main>
    </div>
  );
}

export default App;