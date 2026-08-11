import React, { useEffect, useState } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateDepartment(editingId, form);
      } else {
        await createDepartment(form);
      }
      resetForm();
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || '' });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department');
    }
  };

  return (
    <div className="manage-departments">
      <div className="header-row">
        <h2>Manage Departments</h2>
        <button onClick={() => setShowForm(true)}>+ Add Department</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <input
            type="text"
            placeholder="Department name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.name}</td>
                <td>{dept.description}</td>
                <td>
                  <button onClick={() => handleEdit(dept)}>Edit</button>
                  <button onClick={() => handleDelete(dept.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
