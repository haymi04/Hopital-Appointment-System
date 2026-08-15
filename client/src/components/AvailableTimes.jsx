// client/src/components/AvailableTimes.jsx
//
// Reusable slot picker: pick a date, see the doctor's open time slots for
// that day, pick one. Meant to be dropped into Member 3's booking page —
// pass a doctorId and an onSelectSlot(date, time) callback.
import React, { useState, useEffect } from 'react';
import { getAvailableSlots } from '../services/departmentService';

const AvailableTimes = ({ doctorId, onSelectSlot }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId || !date) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError('');
        setSelectedSlot(null);
        const res = await getAvailableSlots(doctorId, date);
        setSlots(res.availableSlots || []);
      } catch (err) {
        setError('Could not load available times.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, date]);

  const handlePick = (time) => {
    setSelectedSlot(time);
    if (onSelectSlot) onSelectSlot(date, time);
  };

  if (!doctorId) return null;

  return (
    <div className="available-times">
      <label htmlFor="appointment-date">Choose a date</label>
      <input
        id="appointment-date"
        type="date"
        min={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {loading && <p>Loading available times...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <p>No open slots on this date — try another day.</p>
      )}

      <div className="available-times-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
        {slots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => handlePick(time)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '6px',
              border: selectedSlot === time ? '2px solid #1d4ed8' : '1px solid #d1d5db',
              background: selectedSlot === time ? '#dbeafe' : 'white',
              cursor: 'pointer',
              fontWeight: selectedSlot === time ? 600 : 400,
            }}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvailableTimes;
