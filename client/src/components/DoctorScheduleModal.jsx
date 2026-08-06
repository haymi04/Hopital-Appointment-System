// client/src/components/DoctorScheduleModal.jsx
import React, { useState, useEffect } from 'react';
import { getDoctorAvailability, addAvailabilitySlot, deleteAvailabilitySlot } from '../services/doctorService';

const DoctorScheduleModal = ({ isOpen, onClose, doctor }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');

  const fetchSchedule = async () => {
    if (!doctor) return;
    try {
      setLoading(true);
      const res = await getDoctorAvailability(doctor.doctor_id);
      if (res.success) {
        setSchedules(res.data);
      }
    } catch (err) {
      setError('Failed to fetch schedules.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && doctor) {
      fetchSchedule();
    }
  }, [isOpen, doctor]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await addAvailabilitySlot({
        doctor_id: doctor.doctor_id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      });
      fetchSchedule();
    } catch (err) {
      alert('Failed to add availability slot');
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await deleteAvailabilitySlot(id);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete slot');
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: '24px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>
            Schedule: Dr. {doctor.first_name} {doctor.last_name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Existing Schedules */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '14px' }}>Current Availability</h4>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#64748b' }}>Loading schedule...</p>
          ) : schedules.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748b' }}>No time slots added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {schedules.map((slot) => (
                <div key={slot.id} style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#0f172a',
                  borderRadius: '6px',
                  border: '1px solid #334155'
                }}>
                  <div>
                    <strong style={{ color: '#38bdf8' }}>{slot.day_of_week}:</strong> {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to Add New Slot */}
        <form onSubmit={handleAddSlot} style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '14px' }}>Add Working Slot</h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '8px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Add Slot
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorScheduleModal;