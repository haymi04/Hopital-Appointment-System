-- database/seed.sql

-- 1. Seed Departments
INSERT INTO departments (name) VALUES 
  ('Cardiology'),
  ('Neurology'),
  ('Pediatrics'),
  ('Orthopedics')
ON CONFLICT DO NOTHING;

-- 2. Seed Users (Doctors)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, gender) VALUES
  ('dr.johnson@medcare.com', '$2a$10$e8R45T/3R4.N/y3w71N.5eX2yqX1234567890abcdefghijklm', 'DOCTOR', 'Robert', 'Johnson', '+251911112233', 'Male'),
  ('dr.alemu@medcare.com', '$2a$10$e8R45T/3R4.N/y3w71N.5eX2yqX1234567890abcdefghijklm', 'DOCTOR', 'Sara', 'Alemu', '+251922334455', 'Female'),
  ('dr.chen@medcare.com', '$2a$10$e8R45T/3R4.N/y3w71N.5eX2yqX1234567890abcdefghijklm', 'DOCTOR', 'David', 'Chen', '+251933445566', 'Male')
ON CONFLICT (email) DO NOTHING;

-- 3. Seed Doctor Profiles
INSERT INTO doctors (user_id, department_id, specialization, experience_years, biography) VALUES
  (
    (SELECT id FROM users WHERE email = 'dr.johnson@medcare.com'),
    (SELECT id FROM departments WHERE name = 'Cardiology'),
    'Interventional Cardiology',
    12,
    'Specialist in cardiovascular health and preventive care with over a decade of clinical experience.'
  ),
  (
    (SELECT id FROM users WHERE email = 'dr.alemu@medcare.com'),
    (SELECT id FROM departments WHERE name = 'Neurology'),
    'Pediatric Neurology',
    8,
    'Expert in diagnosing and treating neurological conditions in children and young adults.'
  ),
  (
    (SELECT id FROM users WHERE email = 'dr.chen@medcare.com'),
    (SELECT id FROM departments WHERE name = 'Pediatrics'),
    'General Pediatrics',
    5,
    'Dedicated pediatrician focused on child development, adolescent medicine, and preventive health.'
  );

-- 4. Seed Doctor Availability
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
  ((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.johnson@medcare.com'), 'Monday', '08:30', '12:30'),
  ((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.johnson@medcare.com'), 'Wednesday', '08:30', '12:30'),
  ((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.alemu@medcare.com'), 'Tuesday', '09:00', '13:00'),
  ((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.alemu@medcare.com'), 'Thursday', '09:00', '13:00'),
  ((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'dr.chen@medcare.com'), 'Monday', '10:00', '16:00');
  
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, gender, date_of_birth)
VALUES (
    'admin@hospital.com',
    '$2b$10$EhPRDgWBVuP.m4gcMzeWpeuOrZvGnyhivXgMFUMEj1I0Xoqxl4Pc2', -- Verified hash of 'admin123'
    'ADMIN',
    'System',
    'Admin',
    '+251 911 223 344',
    'Male',
    '1990-01-01'
);
