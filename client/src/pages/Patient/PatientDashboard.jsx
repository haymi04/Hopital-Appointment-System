import { useNavigate } from "react-router-dom";
import AppointmentCard from "../../components/AppointmentCard";

import "../../styles/Patient/PatientDashboard.css";

function Dashboard({
  user,
  appointments,
  doctors,
  cancelAppointment,
}) {
  const navigate = useNavigate();

  const upcomingAppointments = appointments.filter(
  (appointment) =>
    appointment.status === "APPROVED"
);

const completedAppointments = appointments.filter(
  (appointment) =>
    appointment.status === "COMPLETED"
);

const cancelledAppointments = appointments.filter(
  (appointment) =>
    appointment.status === "CANCELLED"
);

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div>
          <h1>Welcome back!  {user?.first_name || "Patient"} 👋</h1>
          <p>Here's your appointment overview.</p>
        </div>

        <button
          className="primary-btn"
           onClick={() => navigate("/patient/book")}
        >
          + Book Appointment
        </button>
      </div>

      {/* STATISTICS */}
      <div className="stats">

        <div className="stat-card blue">
          <span>Upcoming</span>

          <strong>
            {upcomingAppointments.length}
          </strong>

          <small>Appointments</small>
        </div>

        <div className="stat-card green">
          <span>Completed</span>

          <strong>
            {completedAppointments.length}
          </strong>

          <small>Appointments</small>
        </div>

        <div className="stat-card red">
          <span>Cancelled</span>

          <strong>
            {cancelledAppointments.length}
          </strong>

          <small>Appointments</small>
        </div>

      </div>

      {/* UPCOMING APPOINTMENTS */}
      <section className="panel">

        <div className="panel-header">
          <h2>Upcoming Appointments</h2>

          <button
            onClick={() => navigate("/patient/history")}
          >
            View All
          </button>
        </div>

        {upcomingAppointments.length === 0 ? (

          <div className="empty">
            <p>No upcoming appointments.</p>

            <button
              className="primary-btn"
             onClick={() => navigate("/patient/book")}
            >
              Book your first appointment
            </button>
          </div>

        ) : (

          <div className="appointment-list">

            {upcomingAppointments
              .slice(0, 3)
              .map((appointment) => (

                <AppointmentCard
                  key= {appointment.id}
                  appointment={appointment}
                  doctors={doctors}
                  onCancel={cancelAppointment}
                />

              ))}

          </div>

        )}

      </section>
    </>
  );
}

export default Dashboard;