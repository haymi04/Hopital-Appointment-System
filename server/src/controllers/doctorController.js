// server/src/controllers/doctorController.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// 1. GET /api/doctors - Fetch all doctors
const getAllDoctors = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.gender,
        dept.name AS department_name,
        d.department_id,
        d.specialization,
        d.experience_years,
        d.biography
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dept ON d.department_id = dept.id
      ORDER BY d.id DESC;
    `;

    const { rows } = await pool.query(query);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 2. GET /api/doctors/:id - Fetch a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.gender,
        dept.name AS department_name,
        d.department_id,
        d.specialization,
        d.experience_years,
        d.biography
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 3. POST /api/doctors - Create user & doctor record (Transaction)
const createDoctor = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      gender,
      department_id,
      specialization,
      experience_years,
      biography,
    } = req.body;

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    await client.query('BEGIN');

    // Insert into users table
    const userInsertQuery = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, phone, gender)
      VALUES ($1, $2, 'DOCTOR', $3, $4, $5, $6)
      RETURNING id;
    `;
    const userValues = [email, password_hash, first_name, last_name, phone, gender];
    const userResult = await client.query(userInsertQuery, userValues);
    const userId = userResult.rows[0].id;

    // Insert into doctors table
    const doctorInsertQuery = `
      INSERT INTO doctors (user_id, department_id, specialization, experience_years, biography)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const doctorValues = [userId, department_id, specialization, experience_years, biography];
    const doctorResult = await client.query(doctorInsertQuery, doctorValues);
    const doctorId = doctorResult.rows[0].id;

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor_id: doctorId, user_id: userId },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating doctor:', error);

    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    res.status(500).json({ success: false, message: 'Server error during creation' });
  } finally {
    client.release();
  }
};

// 4. PUT /api/doctors/:id - Update doctor profile info
const updateDoctor = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      phone,
      department_id,
      specialization,
      experience_years,
      biography,
    } = req.body;

    await client.query('BEGIN');

    // Fetch matching user_id
    const doctorRes = await client.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
    if (doctorRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const userId = doctorRes.rows[0].user_id;

    // Update users table
    await client.query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW() WHERE id = $4`,
      [first_name, last_name, phone, userId]
    );

    // Update doctors table
    await client.query(
      `UPDATE doctors SET department_id = $1, specialization = $2, experience_years = $3, biography = $4, updated_at = NOW() WHERE id = $5`,
      [department_id, specialization, experience_years, biography, id]
    );

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Doctor updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating doctor:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  } finally {
    client.release();
  }
};

// 5. DELETE /api/doctors/:id - Remove doctor profile & user record
const deleteDoctor = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const doctorRes = await client.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
    if (doctorRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const userId = doctorRes.rows[0].user_id;

    // Delete doctor and user records
    await client.query('DELETE FROM doctors WHERE id = $1', [id]);
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting doctor:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};