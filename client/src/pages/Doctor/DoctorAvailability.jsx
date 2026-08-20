import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/Doctor/DoctorAvailability.css";

const API = "http://localhost:5000/api";

function DoctorAvailability({ user }) {
  const [availability, setAvailability] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // =========================
  // GET AVAILABILITY
  // =========================

  const getAvailability = async () => {
    if (!user?.doctor_id) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/availability/doctor/${user.doctor_id}`
      );

      setAvailability(response.data.data || []);
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvailability();
  }, [user]);

  // =========================
  // ADD AVAILABILITY
  // =========================

  const addAvailability = async (e) => {
    e.preventDefault();

    if (!dayOfWeek || !startTime || !endTime) {
      alert("Please select a day, start time and end time.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    try {
      await axios.post(`${API}/availability`, {
        doctor_id: user.doctor_id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      });

      alert("Availability added successfully.");

      setDayOfWeek("");
      setStartTime("");
      setEndTime("");

      await getAvailability();
    } catch (error) {
      console.error("Error adding availability:", error);

      alert(
        error.response?.data?.message ||
          "Could not add availability."
      );
    }
  };

  // =========================
  // DELETE AVAILABILITY
  // =========================

  const deleteAvailability = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this availability?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/availability/${id}`);

      await getAvailability();
    } catch (error) {
      console.error("Error deleting availability:", error);

      alert("Could not delete availability.");
    }
  };

  return (
    <div className="doctor-availability">

      {/* PAGE HEADER */}

      <div className="dashboard-page-header">
        <div>
          <h2>Availability</h2>
          <p>
            Manage your weekly availability and appointment hours.
          </p>
        </div>
      </div>

      {/* ADD AVAILABILITY */}

      <div className="availability-card">

        <h3>Add Availability</h3>

        <form onSubmit={addAvailability}>

          <div className="availability-form-grid">

            <div className="form-group">
              <label>Day</label>

              <select
                value={dayOfWeek}
                onChange={(e) =>
                  setDayOfWeek(e.target.value)
                }
              >
                <option value="">
                  Select day
                </option>

                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Start Time</label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>End Time</label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            + Add Availability
          </button>

        </form>
      </div>

      {/* EXISTING AVAILABILITY */}

      <div className="availability-card">

        <div className="section-header">
          <div>
            <h3>Your Weekly Availability</h3>
            <p>
              Your recurring appointment hours.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading availability...</p>
        ) : availability.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              🕐
            </div>

            <h3>No availability set</h3>

            <p>
              Add your available days and working hours
              above.
            </p>
          </div>
        ) : (
          <div className="availability-list">

            {availability.map((slot) => (
              <div
                className="availability-row"
                key={slot.id}
              >

                <div>
                  <strong>
                    {slot.day_of_week}
                  </strong>
                </div>

                <div>
                  {slot.start_time.slice(0, 5)}
                  {" - "}
                  {slot.end_time.slice(0, 5)}
                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteAvailability(slot.id)
                  }
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default DoctorAvailability;