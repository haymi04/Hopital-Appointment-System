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