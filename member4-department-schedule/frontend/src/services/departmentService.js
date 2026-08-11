import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDepartments = () =>
  axios.get(`${API_BASE}/departments`).then((res) => res.data);

export const getDepartment = (id) =>
  axios.get(`${API_BASE}/departments/${id}`).then((res) => res.data);

export const createDepartment = (data) =>
  axios
    .post(`${API_BASE}/departments`, data, { headers: authHeader() })
    .then((res) => res.data);

export const updateDepartment = (id, data) =>
  axios
    .put(`${API_BASE}/departments/${id}`, data, { headers: authHeader() })
    .then((res) => res.data);

export const deleteDepartment = (id) =>
  axios
    .delete(`${API_BASE}/departments/${id}`, { headers: authHeader() })
    .then((res) => res.data);
