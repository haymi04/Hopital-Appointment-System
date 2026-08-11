import React, { useEffect, useState } from 'react';
import { getAvailableSlots } from '../services/scheduleService';

// Renders the "Available Times" grid seen on the Doctor Profile Page.
// Parent (booking flow, owned by Member 3) passes doctorId + date,
// and receives the chosen slot via onSelectSlot.
export default function AvailableTimes({ doctorId, date, onSelectSlot }) {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId || !date) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    getAvailableSlots(doctorId, date)
      .then((data) => {
        if (!cancelled) setSlots(data.slots || []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load available times');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [doctorId, date]);

  const formatTime = (time24) => {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  const handleSelect = (slot) => {
    setSelected(slot);
    if (onSelectSlot) onSelectSlot(slot);
  };

  if (loading) return <p>Loading available times...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (slots.length === 0) return <p>No available times for this date.</p>;

  return (
    <div className="available-times">
      <h4>Available Times</h4>
      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            key={slot}
            className={selected === slot ? 'slot selected' : 'slot'}
            onClick={() => handleSelect(slot)}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}
