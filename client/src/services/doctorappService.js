import axios from "axios";

const API = "http://localhost:5000/api";

export const getDoctorAppointments = async () => {
  const response = await axios.get(
    `${API}/appointments/doctor`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await axios.put(
    `${API}/appointments/${id}`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};