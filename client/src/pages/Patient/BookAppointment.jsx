import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/Patient/BookAppointment.css";

const API = "http://localhost:5000/api";

function BookAppointment({
  doctors,
  doctor,
  setDoctor,
  date,
  setDate,
  appointmentTime,
  setAppointmentTime,
  reason,
  setReason,
  bookAppointment,
}) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!doctor || !date) {
        setAvailableSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);

        const response = await axios.get(
          `${API}/availability/doctor/${doctor}/slots`,
          {
            params: {
              date: date,
            },
          }
        );

        setAvailableSlots(response.data.slots || []);
      } catch (error) {
        console.error(
          "Error loading available slots:",
          error
        );

        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [doctor, date]);

  return (
    <section className="booking-page">

      <div className="page-title">
        <h1>Book Appointment</h1>
        <p>
          Choose a doctor and convenient appointment time.
        </p>
      </div>

      <form
        className="booking-card"
        onSubmit={bookAppointment}
      >

        {/* DOCTOR */}
        <label>Select Doctor</label>

        <select
          value={doctor}
          onChange={(e) => {
            setDoctor(e.target.value);
            setAppointmentTime("");
          }}
        >
          <option value="">
            Choose a doctor
          </option>

          {doctors.map((doc) => (
            <option
              key={doc.doctor_id}
              value={doc.doctor_id}
            >
              Dr. {doc.first_name} {doc.last_name}
              {" — "}
              {doc.specialization}
            </option>
          ))}
        </select>

        {/* DATE */}
        <label>Select Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setAppointmentTime("");
          }}
        />

        {/* TIME */}
        <label>Available Time</label>

        {loadingSlots && (
          <p>Loading available times...</p>
        )}

        {!loadingSlots &&
          doctor &&
          date &&
          availableSlots.length === 0 && (
            <p>No available appointments for this date.</p>
          )}

        <div className="time-grid">
          {availableSlots.map((slot) => (
            <button
              type="button"
              key={slot.appointment_time}
              className={
                appointmentTime === slot.appointment_time
                  ? "time selected"
                  : "time"
              }
              onClick={() =>
                setAppointmentTime(
                  slot.appointment_time
                )
              }
            >
              {slot.appointment_time}
            </button>
          ))}
        </div>

        {/* REASON */}
        <label>Reason for Visit</label>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for your appointment..."
          rows="4"
        />

       

        {/* SUBMIT */}
        <button
          className="confirm-btn"
          type="submit"
        >
          Confirm Appointment
        </button>

      </form>
    </section>
  );
}

export default BookAppointment;
