const pool = require("../config/database");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

/**
 * Register a new patient
 */
const registerPatient = async (patientData) => {
    const client = await pool.connect();
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            phone,
            gender,
            date_of_birth,
            blood_group,
            emergency_contact_name,
            emergency_contact_phone,
            address
        } = patientData;

        // Check if user already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error("Email already exists");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const role = "PATIENT"; // Hardcoded for public registration

        // Start Transaction
        await client.query("BEGIN");

        // 1. Insert user into users table
        const newUserResult = await client.query(
            `
            INSERT INTO users (email, password_hash, role, first_name, last_name, phone, gender, date_of_birth)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, email, role, first_name, last_name
            `,
            [email, passwordHash, role, first_name, last_name, phone, gender, date_of_birth]
        );
        const user = newUserResult.rows[0];

        // 2. Insert patient details
        await client.query(
            `
            INSERT INTO patients (user_id, blood_group, emergency_contact_name, emergency_contact_phone, address)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [user.id, blood_group || null, emergency_contact_name || null, emergency_contact_phone || null, address || null]
        );

        await client.query("COMMIT");
        return user;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Login a user and return token + details
 */
const loginUser = async (email, password) => {
    const result = await pool.query(
        `
        SELECT 
            u.id, u.email, u.password_hash, u.role, u.first_name, u.last_name,
            p.id AS patient_id, d.id AS doctor_id
        FROM users u
        LEFT JOIN patients p ON p.user_id = u.id
        LEFT JOIN doctors d ON d.user_id = u.id
        WHERE u.email = $1
        `,
        [email]
    );

    const user = result.rows[0];

    // If user not found or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    // Return the response data (excluding the hash)
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            patient_id: user.patient_id,
            doctor_id: user.doctor_id
        }
    };
};

module.exports = {
    registerPatient,
    loginUser
};