// client/src/pages/Departments.jsx
import React, { useState, useEffect } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService';
import '../styles/Departments.css';

function Departments({ user }) {
  const isAdmin = user && user.role === 'ADMIN';

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form state — shared for both "add" and "edit"
  const [editingId, setEditingId] = useState(null); // null = add mode
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      setError('Failed to load departments. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setShowForm(false);
  };

  const startEdit = (dept) => {
    setEditingId(dept.id);
    setName(dept.name);
    setDescription(dept.description || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      if (editingId) {
        await updateDepartment(editingId, { name, description });
      } else {
        await createDepartment({ name, description });
      }
      resetForm();
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Something went wrong saving the department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete "${dept.name}"? Doctors assigned to it will become unassigned.`)) return;
    try {
      await deleteDepartment(dept.id);
      setDepartments(departments.filter((d) => d.id !== dept.id));
    } catch (err) {
      alert(err.message || 'Failed to delete department');
    }
  };

  return (
    <div className="departments-container">
      <div className="departments-header">
        <h1>Departments</h1>
        {isAdmin && (
          <button
            className="btn-add-department"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? 'Cancel' : '+ Add Department'}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Department name (e.g. Cardiology)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Department' : 'Create Department'}
          </button>
        </form>
      )}

      {loading && <p className="departments-status">Loading departments...</p>}
      {error && <p className="departments-status departments-error">{error}</p>}

      {!loading && !error && departments.length === 0 && (
        <p className="departments-status">No departments yet.</p>
      )}

      <div className="departments-grid">
        {departments.map((dept) => (
          <div className="department-card" key={dept.id}>
            <h3>{dept.name}</h3>
            <p>{dept.description || 'No description available.'}</p>
            {isAdmin && (
              <div className="department-card-actions">
                <button onClick={() => startEdit(dept)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(dept)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Departments;
