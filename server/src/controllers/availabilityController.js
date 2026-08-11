// server/src/controllers/availabilityController.js
const pool = require('../config/database');

// 1. GET /api/availability/doctor/:doctorId - Get availability slots for a doctor
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const query = `
      SELECT id, doctor_id, day_of_week, start_time, end_time
      FROM doctor_availability
      WHERE doctor_id = $1
      ORDER BY 
        CASE day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END ASC;
    `;
    const { rows } = await pool.query(query, [doctorId]);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. POST /api/availability - Add an availability slot for a doctor
const addAvailabilitySlot = async (req, res) => {
  try {
    const { doctor_id, day_of_week, start_time, end_time } = req.body;

    const query = `
      INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [doctor_id, day_of_week, start_time, end_time];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ success: true, message: 'Availability slot added', data: rows[0] });
  } catch (error) {
    console.error('Error adding availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. DELETE /api/availability/:id - Remove an availability slot
const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM doctor_availability WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDoctorAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
};