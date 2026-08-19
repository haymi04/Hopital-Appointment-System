-- =========================================================
-- Member 4: Department & Schedule
-- Run this AFTER the `doctors` table already exists (Member 2's part).
-- =========================================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Doctor's recurring weekly availability
-- day_of_week: 0 = Sunday ... 6 = Saturday
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (start_time < end_time)
);

-- One-off overrides: a specific date the doctor is off, or has special hours
CREATE TABLE IF NOT EXISTS schedule_overrides (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_unavailable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (doctor_id, override_date)
);

-- Optional but recommended: link doctors to departments if this column
-- doesn't already exist in Member 2's doctors table.
-- ALTER TABLE doctors ADD COLUMN department_id INTEGER REFERENCES departments(id);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedule_overrides_doctor_date ON schedule_overrides(doctor_id, override_date);
