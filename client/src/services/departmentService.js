// client/src/services/departmentService.js
const API_BASE = 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. Get all departments
export const getDepartments = async () => {
  const res = await fetch(`${API_BASE}/departments`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
};

// 2. Create a new department (ADMIN only)
export const createDepartment = async (departmentData) => {
  const res = await fetch(`${API_BASE}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(departmentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create department');
  return data;
};

// 3. Update a department (ADMIN only)
export const updateDepartment = async (id, departmentData) => {
  const res = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(departmentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update department');
  return data;
};

// 4. Delete a department (ADMIN only)
export const deleteDepartment = async (id) => {
  const res = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete department');
  return data;
};

// 5. Get bookable time slots for a doctor on a given date
export const getAvailableSlots = async (doctorId, date) => {
  const res = await fetch(`${API_BASE}/availability/doctor/${doctorId}/slots?date=${date}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch available slots');
  return data;
};
