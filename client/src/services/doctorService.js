// client/src/services/doctorService.js
const API_BASE = 'http://localhost:5000/api';

// 1. Get all doctors
export const getDoctors = async () => {
  const res = await fetch(`${API_BASE}/doctors`);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
};

// 2. Create a new doctor
export const createDoctor = async (doctorData) => {
  const res = await fetch(`${API_BASE}/doctors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) throw new Error('Failed to create doctor');
  return res.json();
};

// 3. Delete a doctor
export const deleteDoctor = async (id) => {
  const res = await fetch(`${API_BASE}/doctors/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete doctor');
  return res.json();
};

// 4. Get schedule/availability for a doctor
export const getDoctorAvailability = async (doctorId) => {
  const res = await fetch(`${API_BASE}/availability/doctor/${doctorId}`);
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
};

// 5. Add availability slot
export const addAvailabilitySlot = async (slotData) => {
  const res = await fetch(`${API_BASE}/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slotData),
  });
  if (!res.ok) throw new Error('Failed to add schedule slot');
  return res.json();
};

// 6. Delete availability slot
export const deleteAvailabilitySlot = async (id) => {
  const res = await fetch(`${API_BASE}/availability/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete slot');
  return res.json();
};