CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(50) NOT NULL 
        CHECK(role IN ('PATIENT', 'DOCTOR', 'ADMIN', 'RECEPTIONIST')),

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(50),

    gender VARCHAR(20),

    date_of_birth DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) UNIQUE NOT NULL,

    description TEXT
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,

    blood_group VARCHAR(10),

    emergency_contact_name VARCHAR(100),

    emergency_contact_phone VARCHAR(50),

    address TEXT,


    CONSTRAINT fk_patient_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    department_id INT, -- Removed NOT NULL so ON DELETE SET NULL works
    specialization VARCHAR(255),
    experience_years INT,
    biography TEXT,

    CONSTRAINT fk_doctor_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_doctor_department
        FOREIGN KEY(department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);

CREATE TABLE doctor_availability (

    id SERIAL PRIMARY KEY,

    doctor_id INT NOT NULL,

    day_of_week VARCHAR(15) NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,


    CONSTRAINT fk_availability_doctor
        FOREIGN KEY(doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);

CREATE TABLE appointments (

    id SERIAL PRIMARY KEY,

    patient_id INT NOT NULL,

    doctor_id INT NOT NULL,

    created_by_user_id INT NOT NULL,


    appointment_date DATE NOT NULL,

    appointment_time TIME NOT NULL,


    status VARCHAR(50) NOT NULL
        CHECK(status IN 
        ('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED')),


    reason TEXT,

    cancelled_reason TEXT,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_appointment_patient
        FOREIGN KEY(patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY(doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_appointment_creator
        FOREIGN KEY(created_by_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,


    CONSTRAINT unique_doctor_schedule
        UNIQUE(doctor_id, appointment_date, appointment_time)
);