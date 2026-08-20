import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Doctor/DoctorDashboard.css";
import { getDoctorAppointments } from "../../services/doctorappService";
import { getAvailableSlots } from "../../services/availabilityService";
function DoctorDashboard({ user }) {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

useEffect(() => {
  const loadDashboardData = async () => {
    if (!user?.doctor_id) return;

    try {
      const appointmentsData =
        await getDoctorAppointments();

      setAppointments(appointmentsData || []);

      const today = new Date();

      const year = today.getFullYear();
      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        today.getDate()
      ).padStart(2, "0");

      const todayString =
        `${year}-${month}-${day}`;

      const slots = await getAvailableSlots(
        user.doctor_id,
        todayString
      );

      setAvailableSlots(slots);

    } catch (error) {
      console.error(
        "Error loading dashboard data:",
        error
      );
    }
  };

  loadDashboardData();
}, [user]);
  // =========================
  // DATE HELPERS
  // =========================

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getAppointmentDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  // =========================
  // APPOINTMENT COUNTS
  // =========================

  const todayAppointments = appointments.filter(
    (appointment) =>
      getAppointmentDate(appointment.appointment_date) ===
      today
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "APPROVED" &&
      getAppointmentDate(appointment.appointment_date) >=
        today
  );

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED"
  );

  return (
    <div className="doctor-dashboard">

      {/* PAGE HEADER */}

      <div className="dashboard-page-header">

        <div>

          <h2>
            Welcome, Dr. {user?.first_name || "Doctor"} 👋
          </h2>

          <p>
            Here is an overview of your appointments and schedule.
          </p>

        </div>

      </div>


      {/* STATISTICS */}

      <div className="stats-grid">

        {/* TODAY */}

        <div className="stat-card">

          <div className="stat-icon">
            📅
          </div>

          <div>

            <h3>
              {todayAppointments.length}
            </h3>

            <p>
              Today's Appointments
            </p>

          </div>

        </div>


        {/* UPCOMING */}

        <div className="stat-card">

          <div className="stat-icon">
            🕐
          </div>

          <div>

            <h3>
              {upcomingAppointments.length}
            </h3>

            <p>
              Upcoming Appointments
            </p>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="stat-card">

          <div className="stat-icon">
            ✅
          </div>

          <div>

            <h3>
              {completedAppointments.length}
            </h3>

            <p>
              Completed
            </p>

          </div>

        </div>


        {/* AVAILABLE SLOTS */}

        <div className="stat-card">

          <div className="stat-icon">
            ⏰
          </div>

          <div>

            <h3>
            {availableSlots.length}
          </h3>

            <p>
              Available Slots
            </p>

          </div>

        </div>

      </div>


      {/* TODAY'S APPOINTMENTS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Today's Appointments
            </h2>

            <p>
              Your scheduled appointments for today
            </p>

          </div>

          <button
            className="view-all-btn"
            onClick={() =>
              navigate("/doctor/appointments")
            }
          >
            View All
          </button>

        </div>


        {todayAppointments.length === 0 ? (

          <div className="empty-state">

            <div className="empty-state-icon">
              📅
            </div>

            <h3>
              No appointments today
            </h3>

            <p>
              You don't have any appointments scheduled for today.
            </p>

          </div>

        ) : (

          <div className="doctor-today-list">

            {todayAppointments
              .slice(0, 5)
              .map((appointment) => (

                <div
                  className="doctor-today-row"
                  key={appointment.id}
                >

                  {/* PATIENT */}

                  <div className="today-patient">

                    <strong>
                      {appointment.patient_first_name}{" "}
                      {appointment.patient_last_name}
                    </strong>

                    <span>
                      {appointment.reason || "General consultation"}
                    </span>

                  </div>


                  {/* TIME */}

                  <div className="today-time">

                    {new Date(
                      `1970-01-01T${appointment.appointment_time}`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}

                  </div>


                  {/* STATUS */}

                  <span
                    className={`appointment-status ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default DoctorDashboard;