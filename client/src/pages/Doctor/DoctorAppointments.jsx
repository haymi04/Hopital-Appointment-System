import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/Doctor/DoctorAppointments.css";

import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../services/doctorappService";

function DoctorAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // =========================
  // GET DOCTOR APPOINTMENTS
  // =========================

  const getAppointments = async () => {
      try {
        setLoading(true);

      const data = await getDoctorAppointments();

      setAppointments(data || []);

      } catch (error) {
        console.error(
          "Error loading doctor appointments:",
          error
        );
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if (user?.doctor_id) {
      getAppointments();
    }
  }, [user]);

  // =========================
  // MARK AS COMPLETED
  // =========================

  const completeAppointment = async (id) => {
  const confirmed = window.confirm(
    "Mark this appointment as completed?"
  );

  if (!confirmed) return;

  try {
    await updateAppointmentStatus(id, "COMPLETED");

    await getAppointments();

  } catch (error) {
    console.error(
      "Error completing appointment:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Could not complete appointment."
    );
  }
};

  // =========================
  // FILTER APPOINTMENTS
  // =========================

const getLocalDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLocalDateFromAppointment = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const today = getLocalDate();
const filteredAppointments = appointments.filter(
  (appointment) => {

    const appointmentDate =
      getLocalDateFromAppointment(
        appointment.appointment_date
      );

    // ALL
    if (filter === "ALL") {
      return true;
    }

    // TODAY
    if (filter === "TODAY") {
      return appointmentDate === today;
    }

    // UPCOMING
    if (filter === "UPCOMING") {
      return (
        appointment.status === "APPROVED" &&
        appointmentDate >= today
      );
    }

    // COMPLETED
    if (filter === "COMPLETED") {
      return appointment.status === "COMPLETED";
    }

    return true;
  }
);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (!time) return "—";

    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="doctor-appointments">

      {/* PAGE HEADER */}

      <div className="dashboard-page-header">

        <div>
          <h2>Appointments</h2>

          <p>
            View and manage your patient appointments.
          </p>
        </div>

      </div>


      {/* FILTERS */}

      <div className="appointment-filters">

        <button
          className={
            filter === "ALL"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={
            filter === "TODAY"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => setFilter("TODAY")}
        >
          Today
        </button>

        <button
          className={
            filter === "UPCOMING"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => setFilter("UPCOMING")}
        >
          Upcoming
        </button>

        <button
          className={
            filter === "COMPLETED"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>

      </div>


      {/* APPOINTMENTS CARD */}

      <div className="doctor-appointments-card">

        {loading ? (

          <div className="appointment-message">
            Loading appointments...
          </div>

        ) : filteredAppointments.length === 0 ? (

          <div className="appointment-message">

            <div className="appointment-empty-icon">
              📅
            </div>

            <h3>No appointments found</h3>

            <p>
              There are no appointments in this category.
            </p>

          </div>

        ) : (

          <div className="appointments-table-wrapper">

            <table className="appointments-table">

              <thead>

                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredAppointments.map(
                  (appointment) => (

                    <tr key={appointment.id}>

                      {/* PATIENT */}

                      <td>
                        <div className="patient-info">

                          <strong>
                            {appointment.patient_first_name}{" "}
                            {appointment.patient_last_name}
                          </strong>

                          {appointment.patient_phone && (
                            <span>
                              {appointment.patient_phone}
                            </span>
                          )}

                        </div>
                      </td>


                      {/* DATE */}

                      <td>
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </td>


                      {/* TIME */}

                      <td>
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </td>


                      {/* REASON */}

                      <td>
                        {appointment.reason || "—"}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`appointment-status ${appointment.status.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        {appointment.status ===
                        "APPROVED" ? (

                          <button
                            className="complete-btn"
                            onClick={() =>
                              completeAppointment(
                                appointment.id
                              )
                            }
                          >
                            Complete
                          </button>

                        ) : (

                          <span className="no-action">
                            —
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}

export default DoctorAppointments;