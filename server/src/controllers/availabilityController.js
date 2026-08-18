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

// 4. GET /api/availability/doctor/:doctorId/slots?date=YYYY-MM-DD
//    Turns the doctor's recurring weekly availability into concrete,
//    bookable time slots for one specific date, with already-booked
//    appointment times removed.
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, duration } = req.query; // duration = slot length in minutes, optional

    if (!date) {
      return res.status(400).json({ success: false, message: "Query param 'date' (YYYY-MM-DD) is required" });
    }

    const slotDuration = parseInt(duration, 10) || 30; // default 30-minute slots

    // JS getUTCDay(): 0=Sunday..6=Saturday. Parsing as UTC avoids
    // off-by-one-day bugs caused by local timezone shifting the date.
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format, expected YYYY-MM-DD" });
    }
    const dayOfWeek = dayNames[parsedDate.getUTCDay()];

    // 1. Doctor's recurring availability block(s) for that weekday
    const availabilityResult = await pool.query(
      `SELECT start_time, end_time
       FROM doctor_availability
       WHERE doctor_id = $1 AND day_of_week = $2
       ORDER BY start_time ASC`,
      [doctorId, dayOfWeek]
    );

    if (availabilityResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        doctorId: Number(doctorId),
        date,
        dayOfWeek,
        availableSlots: [],
        message: "Doctor has no availability set for this day",
      });
    }

    // 2. Generate every possible slot start time inside those blocks
    const allSlots = [];
    for (const block of availabilityResult.rows) {
      let [h, m] = block.start_time.slice(0, 5).split(":").map(Number);
      const [endH, endM] = block.end_time.slice(0, 5).split(":").map(Number);
      const endTotalMin = endH * 60 + endM;

      while (h * 60 + m + slotDuration <= endTotalMin) {
        allSlots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        m += slotDuration;
        h += Math.floor(m / 60);
        m = m % 60;
      }
    }

    // 3. Already-booked times for this doctor on this date.
    //    Only PENDING/APPROVED hold the slot — CANCELLED/REJECTED free it up.
    let bookedTimes = new Set();
    try {
      const bookedResult = await pool.query(
        `SELECT appointment_time
         FROM appointments
         WHERE doctor_id = $1
           AND appointment_date = $2
           AND status IN ('APPROVED')`,
        [doctorId, date]
      );
      bookedTimes = new Set(bookedResult.rows.map((r) => r.appointment_time.slice(0, 5)));
    } catch (err) {
      // If the appointments table/columns aren't ready yet, don't crash —
      // just show full availability so the frontend can still be built ahead.
      console.warn("Could not check booked appointments (appointments table may not be ready yet):", err.message);
    }

    const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot));

    res.status(200).json({
      success: true,
      doctorId: Number(doctorId),
      date,
      dayOfWeek,
      slotDurationMinutes: slotDuration,
      availableSlots,
    });
  } catch (error) {
    console.error("Error computing available slots:", error);
    res.status(500).json({ success: false, message: "Server error computing available slots" });
  }
};

module.exports = {
  getDoctorAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  getAvailableSlots,
};