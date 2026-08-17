import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../../components/DoctorCard";

import "../../styles/Patient/SearchDoctors.css";

function SearchDoctors({
  doctors,
  setDoctor,
}) {
  const [searchTerm, setSearchTerm] = useState("");
   const navigate = useNavigate();

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.first_name} ${doc.last_name} ${doc.specialization}`
      .toLowerCase()
      .trim()
      .includes(searchTerm.toLowerCase().trim())
      
  );

  return (
    <section>
      <div className="page-title">
        <h1>Search Doctors</h1>

        <p>
          Find a doctor by name or specialization.
        </p>
      </div>

      <div className="doctor-search">
        <input
          type="text"
          placeholder="Search doctor or specialization..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.doctor_id}
            doctor={doctor}
            onBook={(doctorId) => {
              setDoctor(String(doctorId));
             navigate("/patient/book");
            }}
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="empty">
          <p>No doctors found.</p>
        </div>
      )}
    </section>
  );
}

export default SearchDoctors;
