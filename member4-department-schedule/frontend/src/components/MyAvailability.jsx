import React, { useEffect, useState } from 'react';
import {
  getDoctorSchedule,
  addAvailabilityBlock,
  updateAvailabilityBlock,
  deleteAvailabilityBlock,
} from '../services/scheduleService';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// doctorId would normally come from the logged-in user's JWT/context
export default function MyAvailability({ doctorId }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ day_of_week: 1, start_time: '08:00', end_time: '12:00' });

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await getDoctorSchedule(doctorId);
      setSchedule(data);
    } catch (err) {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) loadSchedule();
  }, [doctorId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addAvailabilityBlock({ doctor_id: doctorId, ...form });
      setShowForm(false);
      loadSchedule();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add time slot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this availability block?')) return;
    try {
      await deleteAvailabilityBlock(id);
      loadSchedule();
    } catch (err) {
      setError('Failed to delete block');
    }
  };

  // Group blocks by day for display, similar to the mockup's calendar + list layout
  const groupedByDay = DAY_NAMES.map((name, idx) => ({
    day: name,
    dayIndex: idx,
    blocks: schedule.filter((s) => s.day_of_week === idx),
  }));

  return (
    <div className="my-availability">
      <div className="header-row">
        <h2>My Availability</h2>
        <button onClick={() => setShowForm(true)}>+ Add Time Slot</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {showForm && (
        <form onSubmit={handleAdd} className="availability-form">
          <select
            value={form.day_of_week}
            onChange={(e) => setForm({ ...form, day_of_week: Number(e.target.value) })}
          >
            {DAY_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
          />
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
          />
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="schedule-list">
          {groupedByDay.map(({ day, blocks }) => (
            <div key={day} className="day-row">
              <strong>{day}</strong>
              {blocks.length === 0 && <span className="muted"> — off</span>}
              {blocks.map((block) => (
                <div key={block.id} className="time-block">
                  <span>{block.start_time} – {block.end_time}</span>
                  <button onClick={() => handleDelete(block.id)}>Delete</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
