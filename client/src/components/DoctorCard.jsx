import "../styles/DoctorCard.css";

function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doctor-card">
      <div className="doctor-avatar large">
        👨‍⚕️
      </div>

      <h3>
        Dr. {doctor.first_name} {doctor.last_name}
      </h3>

      <p className="specialty">
        {doctor.specialization}
      </p>

      <p>
        Doctor ID: {doctor.doctor_id}
      </p>

      <button
        className="primary-btn"
        onClick={() => onBook(doctor.doctor_id)}
      >
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;