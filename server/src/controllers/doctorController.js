// server/controllers/doctorController.js
const db = require("../config/database"); // Your PostgreSQL pool/db connection

// 1. GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        dep.id AS department_id,
        dep.name AS department_name,
        d.specialization,
        d.experience_years,
        d.biography
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dep ON d.department_id = dep.id
      ORDER BY d.id DESC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error fetching doctors" });
  }
};

// 2. ADD A NEW DOCTOR
exports.addDoctor = async (req, res) => {
  const client = await db.connect();
  try {
    const {
      first_name,
      last_name,
      email,
      password_hash,
      phone,
      department_id,
      specialization,
      experience_years,
      biography,
    } = req.body;

    await client.query("BEGIN");

    // Insert into USERS table with role 'DOCTOR'
    const userQuery = `
      INSERT INTO users (first_name, last_name, email, password_hash, phone, role)
      VALUES ($1, $2, $3, $4, $5, 'DOCTOR')
      RETURNING id;
    `;
    const userRes = await client.query(userQuery, [
      first_name,
      last_name,
      email,
      password_hash,
      phone,
    ]);
    const userId = userRes.rows[0].id;

    // Insert into DOCTORS table
    const doctorQuery = `
      INSERT INTO doctors (user_id, department_id, specialization, experience_years, biography)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const doctorRes = await client.query(doctorQuery, [
      userId,
      department_id,
      specialization,
      experience_years,
      biography,
    ]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: doctorRes.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: error.message || "Failed to add doctor" });
  } finally {
    client.release();
  }
};

// 3. UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {
  const { id } = req.params; // doctor_id
  const { department_id, specialization, experience_years, biography } = req.body;

  try {
    const query = `
      UPDATE doctors 
      SET 
        department_id = COALESCE($1, department_id),
        specialization = COALESCE($2, specialization),
        experience_years = COALESCE($3, experience_years),
        biography = COALESCE($4, biography)
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(query, [
      department_id,
      specialization,
      experience_years,
      biography,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor updated successfully", doctor: rows[0] });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

// 4. DELETE DOCTOR
exports.deleteDoctor = async (req, res) => {
  const { id } = req.params; // doctor_id

  try {
    const deleteQuery = `DELETE FROM doctors WHERE id = $1 RETURNING user_id;`;
    const { rows } = await db.query(deleteQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor record not found" });
    }

    // Optionally delete associated user record
    await db.query(`DELETE FROM users WHERE id = $1;`, [rows[0].user_id]);

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
};