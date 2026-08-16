import DoctorCard from "../components/DoctorCard";

import "../style/AppointmentHistory.css";

function AppointmentHistory({
  appointments,
  doctors,
  cancelAppointment,
}) {
  return (
    <section>
      <div className="page-title">
        <h1>Appointment History</h1>

        <p>
          View all your appointments and their status.
        </p>
      </div>

      <div className="history-card">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => {
              const doctor = doctors.find(
                (d) =>
                  Number(d.doctor_id) ===
                  Number(appointment.doctor_id)
              );

              return (
                <tr
                  key={appointment.appointment_id}
                >
                  {/* DOCTOR */}
                  <td>
                    <h4>
                    {doctor
                      ? `Dr. ${doctor.first_name} ${doctor.last_name}`
                      : `Doctor ${appointment.doctor_id}`}
                      </h4>
                      {doctor.specialization}
                  </td>

                  {/* DATE */}
                  <td>
                    {new Date(appointment.appointment_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )|| "—"  }
                  </td>

                  {/* TIME */}
                  <td>
                    {new Date(
                        `1970-01-01T${appointment.appointment_time}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }) || "—"  }
                  </td>

            

                  {/* REASON */}
                  <td>
                    {appointment.reason || "—"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status ${String(
                        appointment.status
                      ).toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    {appointment.status !==
                      "Cancelled" &&
                      appointment.status !==
                        "CANCELLED" &&
                      appointment.status !==
                        "Completed" &&
                      appointment.status !==
                        "COMPLETED" && (
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            cancelAppointment(
                              appointment.id
                            )
                          }
                        >
                          Cancel
                        </button>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="empty">
            <p>No appointment history.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AppointmentHistory;