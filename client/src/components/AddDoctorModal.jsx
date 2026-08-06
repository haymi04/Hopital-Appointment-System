// client/src/components/AddDoctorModal.jsx
import React, { useState } from 'react';
import { createDoctor } from '../services/doctorService';

const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: 'Male',
    department_id: 1, // Default department ID
    specialization: '',
    experience_years: 1,
    biography: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await createDoctor(formData);
      if (res.success) {
        onDoctorAdded();
        onClose();
      } else {
        setError(res.message || 'Failed to create doctor');
      }
    } catch (err) {
      setError('Error connecting to server.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: '24px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Add New Doctor</h2>

        {error && <div style={{ color: '#f87171', marginBottom: '12px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Doctor Email"
            required
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
            <select
              name="gender"
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization (e.g. Cardiology)"
              required
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
            <input
              type="number"
              name="experience_years"
              placeholder="Years Exp."
              onChange={handleChange}
              style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <textarea
            name="biography"
            placeholder="Short Bio..."
            rows="3"
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', background: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '8px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {submitting ? 'Adding...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
