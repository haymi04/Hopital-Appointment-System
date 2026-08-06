// client/src/components/DoctorList.jsx
import React, { useState, useEffect } from 'react';
import { getDoctors, deleteDoctor } from '../services/doctorService';
import AddDoctorModal from './AddDoctorModal';
import DoctorScheduleModal from './DoctorScheduleModal';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState(null);

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctors();
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err) {
      setError('Failed to load doctors. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle Doctor Deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        setDoctors(doctors.filter((doc) => doc.doctor_id !== id));
      } catch (err) {
        alert('Failed to delete doctor');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading doctors...</div>;
  }

  if (error) {
    return <div style={{ color: '#f87171', textAlign: 'center', padding: '40px' }}>{error}</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>Doctor Management</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>Manage hospital doctors and availability schedules</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Add Doctor
        </button>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {doctors.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.doctor_id}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                border: '1px solid #334155',
                padding: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                {/* Department Badge & Experience */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      backgroundColor: '#0369a1',
                      color: '#e0f2fe',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {doctor.department_name || 'General'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {doctor.experience_years} yrs exp.
                  </span>
                </div>

                {/* Name & Specialization */}
                <h3 style={{ margin: '14px 0 4px', fontSize: '18px', color: '#f8fafc' }}>
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#38bdf8', fontWeight: '500' }}>
                  {doctor.specialization}
                </p>

                {/* Contact Information */}
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <div><strong>Email:</strong> {doctor.email}</div>
                  <div><strong>Phone:</strong> {doctor.phone || 'N/A'}</div>
                </div>

                {/* Biography */}
                {doctor.biography && (
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic' }}>
                    "{doctor.biography}"
                  </p>
                )}
              </div>

              {/* Card Action Buttons */}
              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedDoctorForSchedule(doctor)}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleDelete(doctor.doctor_id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal 1: Add New Doctor */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDoctorAdded={fetchDoctors}
      />

      {/* Modal 2: Manage Doctor Availability Schedule */}
      <DoctorScheduleModal
        isOpen={!!selectedDoctorForSchedule}
        onClose={() => setSelectedDoctorForSchedule(null)}
        doctor={selectedDoctorForSchedule}
      />
    </div>
  );
};

export default DoctorList;