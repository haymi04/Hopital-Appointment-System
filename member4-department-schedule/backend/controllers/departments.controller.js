const pool = require('../config/db');

// GET /api/departments
async function getAllDepartments(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM departments ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
}

// GET /api/departments/:id
async function getDepartmentById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch department' });
  }
}

// POST /api/departments
async function createDepartment(req, res) {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO departments (name, description)
       VALUES ($1, $2) RETURNING *`,
      [name.trim(), description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ message: 'A department with that name already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to create department' });
  }
}

// PUT /api/departments/:id
async function updateDepartment(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE departments
       SET name = $1, description = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name.trim(), description || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A department with that name already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to update department' });
  }
}

// DELETE /api/departments/:id
async function deleteDepartment(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    if (err.code === '23503') { // foreign_key_violation
      return res.status(409).json({
        message: 'Cannot delete: doctors are still assigned to this department',
      });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to delete department' });
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
