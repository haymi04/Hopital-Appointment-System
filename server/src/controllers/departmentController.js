// server/src/controllers/departmentController.js
const pool = require("../config/database");

// 1. GET /api/departments — list all departments (public)
exports.getAllDepartments = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM departments ORDER BY name ASC"
    );
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: "Server error fetching departments" });
  }
};

// 2. GET /api/departments/:id — get one department (public)
exports.getDepartmentById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM departments WHERE id = $1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ success: false, message: "Server error fetching department" });
  }
};

// 3. POST /api/departments — create department (ADMIN only)
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Department name is required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO departments (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name.trim(), description || null]
    );

    res.status(201).json({ success: true, message: "Department created", data: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      // unique_violation — departments.name is UNIQUE NOT NULL in schema.sql
      return res.status(409).json({ success: false, message: "A department with that name already exists" });
    }
    console.error("Error creating department:", error);
    res.status(500).json({ success: false, message: "Server error creating department" });
  }
};

// 4. PUT /api/departments/:id — update department (ADMIN only)
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const { rows } = await pool.query(
      `UPDATE departments
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name ? name.trim() : null, description, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Department updated", data: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "A department with that name already exists" });
    }
    console.error("Error updating department:", error);
    res.status(500).json({ success: false, message: "Server error updating department" });
  }
};

// 5. DELETE /api/departments/:id — delete department (ADMIN only)
exports.deleteDepartment = async (req, res) => {
  try {
    // doctors.department_id has ON DELETE SET NULL, so this is safe —
    // doctors in this department just become "unassigned" instead of erroring.
    const { rows } = await pool.query(
      "DELETE FROM departments WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ success: false, message: "Server error deleting department" });
  }
};
