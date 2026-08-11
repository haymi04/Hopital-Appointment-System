import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDoctorSchedule = (doctorId) =>
  axios.get(`${API_BASE}/schedule/${doctorId}`).then((res) => res.data);

export const getAvailableSlots = (doctorId, date) =>
  axios
    .get(`${API_BASE}/schedule/${doctorId}/slots`, { params: { date } })
    .then((res) => res.data);

export const addAvailabilityBlock = (data) =>
  axios
    .post(`${API_BASE}/schedule`, data, { headers: authHeader() })
    .then((res) => res.data);

export const updateAvailabilityBlock = (id, data) =>
  axios
    .put(`${API_BASE}/schedule/${id}`, data, { headers: authHeader() })
    .then((res) => res.data);

export const deleteAvailabilityBlock = (id) =>
  axios
    .delete(`${API_BASE}/schedule/${id}`, { headers: authHeader() })
    .then((res) => res.data);

export const addOverride = (data) =>
  axios
    .post(`${API_BASE}/schedule/override`, data, { headers: authHeader() })
    .then((res) => res.data);
