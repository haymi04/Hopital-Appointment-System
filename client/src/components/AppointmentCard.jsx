import DoctorCard from "../components/DoctorCard";

import "../style/AppointmentCard.css";

function AppointmentCard({ appointment, onCancel, doctors }) {
  const doctor = doctors.find(
    (d) => Number(d.doctor_id) === Number(appointment.doctor_id)
  );

  return (
    <div className="appointment-card">
      <div className="doctor-avatar">👩‍⚕️</div>

      <div className="doctor-info">
        <h3>
          {doctor
            ? `Dr. ${doctor.first_name} ${doctor.last_name}`
            : `Doctor ${appointment.doctor_id}`}
        </h3>

        <p>
          {doctor.specialization}
        </p>

        <small>
          {new Date(appointment.appointment_date).toLocaleDateString(
  "en-US",
  {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
)} -  {new Date(
  `1970-01-01T${appointment.appointment_time}`
).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}
        </small>
      </div>

      <span
        className={`status ${String(
          appointment.status
        ).toLowerCase()}`}
      >
        {appointment.status}
      </span>

      {appointment.status !== "Cancelled" && (
        <button
          className="cancel-btn"
          onClick={() =>
            onCancel(appointment.id)
          }
        >
          Cancel
        </button>
      )}
      
    </div>
  );
}

export default AppointmentCard;
