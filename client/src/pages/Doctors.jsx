import React, { useState, useEffect } from "react";
import "../styles/ManageDoctors.css"; // We will add styling next

function Doctors({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    department_id: "",
    specialization: "",
    experience_years: "",
    biography: "",
  });

  const isAdmin = user?.role === "ADMIN";

  // 1. Fetch Doctors and Departments on Mount
  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors");
      const data = await response.json();
      if (response.ok) {
        setDoctors(data);
      } else {
        setError(data.message || "Failed to fetch doctors");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

 const fetchDepartments = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/departments");
    const data = await response.json();

    if (response.ok) {
      setDepartments(data.data);
    } else {
      console.error("Failed to load departments:", data.message);
    }
  } catch (err) {
    console.error("Failed to load departments:", err);
  }
};

  // Handle Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Add New Doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          password_hash: formData.password, // map password field
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchDoctors(); // Refresh list
      } else {
        alert(data.message || "Error adding doctor");
      }
    } catch (err) {
      alert("Failed to submit form");
    }
  };

  // 3. Update Doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/doctors/${editingDoctor.doctor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            department_id: formData.department_id,
            specialization: formData.specialization,
            experience_years: formData.experience_years,
            biography: formData.biography,
          }),
        }
      );

      if (response.ok) {
        setEditingDoctor(null);
        resetForm();
        fetchDoctors();
      } else {
        alert("Failed to update doctor");
      }
    } catch (err) {
      alert("Error updating doctor");
    }
  };

  // 4. Delete Doctor
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchDoctors();
      } else {
        alert("Failed to delete doctor");
      }
    } catch (err) {
      alert("Error deleting doctor");
    }
  };

  // Open Edit Modal & Populate Form
  const startEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      first_name: doc.first_name,
      last_name: doc.last_name,
      email: doc.email,
      phone: doc.phone || "",
      department_id: doc.department_id || "",
      specialization: doc.specialization || "",
      experience_years: doc.experience_years || "",
      biography: doc.biography || "",
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      department_id: "",
      specialization: "",
      experience_years: "",
      biography: "",
    });
  };

  // Filter Doctors by Search Term
  const filteredDoctors = doctors.filter((doc) => {
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
    const spec = (doc.specialization || "").toLowerCase();
    const dept = (doc.department_name || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || spec.includes(term) || dept.includes(term);
  });

  if (loading) return <div className="page-status">Loading doctor records...</div>;

  return (
    <div className="manage-doctors-container">
      {/* Top Header Controls */}
      <div className="doctors-header-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isAdmin && (
          <button
            className="btn-add-doctor"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            + Add Doctor
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Doctors Table (Screen #14 Style) */}
      <div className="table-card">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Experience</th>
              {isAdmin && <th className="text-right">Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <tr key={doc.doctor_id}>
                  <td className="doc-info-cell">
                    <div className="doc-avatar">
                      {doc.first_name?.[0]}
                      {doc.last_name?.[0]}
                    </div>
                    <div>
                      <div className="doc-name">
                        Dr. {doc.first_name} {doc.last_name}
                      </div>
                      <div className="doc-spec">{doc.specialization || "General"}</div>
                    </div>
                  </td>
                  <td>
                    <span className="dept-badge">
                      {doc.department_name || "Unassigned"}
                    </span>
                  </td>
                  <td>{doc.phone || "N/A"}</td>
                  <td>{doc.experience_years ? `${doc.experience_years} Years` : "N/A"}</td>
                  {isAdmin && (
                    <td className="text-right actions-cell">
                      <button
                        className="btn-icon edit"
                        onClick={() => startEdit(doc)}
                        title="Edit Doctor"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeleteDoctor(doc.doctor_id)}
                        title="Delete Doctor"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="no-data">
                  No doctors found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT DOCTOR MODAL */}
      {(showAddModal || editingDoctor) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingDoctor ? "Edit Doctor Details" : "Add New Doctor"}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDoctor(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor}>
              {!editingDoctor && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g. Cardiology"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Biography</label>
                <textarea
                  name="biography"
                  rows="3"
                  value={formData.biography}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoctor(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingDoctor ? "Save Changes" : "Create Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;