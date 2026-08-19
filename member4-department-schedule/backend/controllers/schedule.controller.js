const pool = require('../config/db');

const SLOT_DURATION_MINUTES = 30; // change if your team wants a different default

// ---------------------------------------------------------------------
// Recurring weekly schedule
// ---------------------------------------------------------------------

// GET /api/schedule/:doctorId
async function getDoctorSchedule(req, res) {
  const { doctorId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM doctor_schedules
       WHERE doctor_id = $1
       ORDER BY day_of_week ASC, start_time ASC`,
      [doctorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
}

// POST /api/schedule   { doctor_id, day_of_week, start_time, end_time }
async function addAvailabilityBlock(req, res) {
  const { doctor_id, day_of_week, start_time, end_time } = req.body;

  if (doctor_id == null || day_of_week == null || !start_time || !end_time) {
    return res.status(400).json({ message: 'doctor_id, day_of_week, start_time and end_time are required' });
  }
  if (start_time >= end_time) {
    return res.status(400).json({ message: 'start_time must be before end_time' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [doctor_id, day_of_week, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add availability block' });
  }
}

// PUT /api/schedule/:id   { start_time, end_time }
async function updateAvailabilityBlock(req, res) {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time || start_time >= end_time) {
    return res.status(400).json({ message: 'Valid start_time and end_time are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE doctor_schedules
       SET start_time = $1, end_time = $2
       WHERE id = $3 RETURNING *`,
      [start_time, end_time, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule block not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update availability block' });
  }
}

// DELETE /api/schedule/:id
async function deleteAvailabilityBlock(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM doctor_schedules WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule block not found' });
    }
    res.json({ message: 'Availability block deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete availability block' });
  }
}

// ---------------------------------------------------------------------
// One-off overrides (day off, or special one-time hours)
// ---------------------------------------------------------------------

// POST /api/schedule/override  { doctor_id, override_date, is_unavailable, start_time, end_time }
async function addOverride(req, res) {
  const { doctor_id, override_date, is_unavailable, start_time, end_time } = req.body;

  if (!doctor_id || !override_date) {
    return res.status(400).json({ message: 'doctor_id and override_date are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO schedule_overrides (doctor_id, override_date, is_unavailable, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (doctor_id, override_date)
       DO UPDATE SET is_unavailable = $3, start_time = $4, end_time = $5
       RETURNING *`,
      [doctor_id, override_date, !!is_unavailable, start_time || null, end_time || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add schedule override' });
  }
}

// ---------------------------------------------------------------------
// Available time slots — the piece patients actually see when booking
// ---------------------------------------------------------------------

// Pure helper: turn a start/end TIME range into an array of "HH:MM" slot strings
function generateSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + durationMinutes <= end) {
    const h = String(Math.floor(current / 60)).padStart(2, '0');
    const m = String(current % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += durationMinutes;
  }
  return slots;
}

// GET /api/schedule/:doctorId/slots?date=YYYY-MM-DD
async function getAvailableSlots(req, res) {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'date query param is required (YYYY-MM-DD)' });
  }

  try {
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();

    // 1. Check for a full-day override
    const overrideResult = await pool.query(
      `SELECT * FROM schedule_overrides WHERE doctor_id = $1 AND override_date = $2`,
      [doctorId, date]
    );
    const override = overrideResult.rows[0];

    if (override && override.is_unavailable) {
      return res.json({ slots: [] });
    }

    // 2. Get working-hour blocks for the day (override hours win if present)
    let blocks;
    if (override && override.start_time && override.end_time) {
      blocks = [{ start_time: override.start_time, end_time: override.end_time }];
    } else {
      const scheduleResult = await pool.query(
        `SELECT start_time, end_time FROM doctor_schedules
         WHERE doctor_id = $1 AND day_of_week = $2`,
        [doctorId, dayOfWeek]
      );
      blocks = scheduleResult.rows;
    }

    if (blocks.length === 0) {
      return res.json({ slots: [] }); // doctor doesn't work this day
    }

    // 3. Generate candidate slots from every block
    let candidateSlots = [];
    for (const block of blocks) {
      candidateSlots.push(
        ...generateSlots(block.start_time, block.end_time, SLOT_DURATION_MINUTES)
      );
    }

    // 4. Remove already-booked times (Member 3's appointments table)
    //    Adjust table/column names to match what Member 3 actually builds.
    const bookedResult = await pool.query(
      `SELECT TO_CHAR(appointment_time, 'HH24:MI') AS time
       FROM appointments
       WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
      [doctorId, date]
    );
    const bookedTimes = bookedResult.rows.map((r) => r.time);

    const availableSlots = candidateSlots.filter((slot) => !bookedTimes.includes(slot));

    res.json({ slots: availableSlots });
  } catch (err) {
    console.error(err);
    // If the appointments table doesn't exist yet (Member 3 hasn't built it),
    // fall back to returning all candidate slots so you can still test your part.
    if (err.code === '42P01') {
      return res.status(200).json({
        slots: [],
        warning: 'appointments table not found yet — booked-slot filtering skipped',
      });
    }
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
}

module.exports = {
  getDoctorSchedule,
  addAvailabilityBlock,
  updateAvailabilityBlock,
  deleteAvailabilityBlock,
  addOverride,
  getAvailableSlots,
  generateSlots, // exported for unit testing
};
