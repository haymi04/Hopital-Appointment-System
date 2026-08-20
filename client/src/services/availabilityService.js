import axios from "axios";

const API = "http://localhost:5000/api";

export const getDoctorAvailability = async (doctorId) => {
  const response = await axios.get(
    `${API}/availability/doctor/${doctorId}`
  );

  return response.data.data || [];
};

export const createAvailability = async (availabilityData) => {
  const response = await axios.post(
    `${API}/availability`,
    availabilityData
  );

  return response.data;
};

export const deleteAvailability = async (id) => {
  const response = await axios.delete(
    `${API}/availability/${id}`
  );

  return response.data;
};

// available slot stat card
export const getAvailableSlots = async (doctorId, date) => {
  const response = await axios.get(
    `${API}/availability/doctor/${doctorId}/slots`,
    {
      params: {
        date: date,
      },
    }
  );

  return response.data.availableSlots || [];
};