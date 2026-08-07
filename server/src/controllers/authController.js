const pool = require("../config/database");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// Register User (with Patient Details)
const registerUser = async (req, res) => {
    // Acquire a client from the pool to handle the transaction
    const client = await pool.connect();

    try {
        const {
            email,
            password,
            role,
            first_name,
            last_name,
            phone,
            gender,
            date_of_birth,
            blood_group,
            emergency_contact_name,
            emergency_contact_phone,
            address
        } = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Start Transaction
        await client.query("BEGIN");

        // 1. Insert user into users table
        const newUserResult = await client.query(
            `
            INSERT INTO users
            (
                email,
                password_hash,
                role,
                first_name,
                last_name,
                phone,
                gender,
                date_of_birth
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                email,
                passwordHash,
                role,
                first_name,
                last_name,
                phone,
                gender,
                date_of_birth
            ]
        );

        const user = newUserResult.rows[0];

        // 2. If registering as a PATIENT, insert details into patients table (store as null if empty)
        if (role === "PATIENT") {
            await client.query(
                `
                INSERT INTO patients
                (
                    user_id,
                    blood_group,
                    emergency_contact_name,
                    emergency_contact_phone,
                    address
                )
                VALUES
                ($1, $2, $3, $4, $5)
                `,
                [
                    user.id,
                    blood_group || null,
                    emergency_contact_name || null,
                    emergency_contact_phone || null,
                    address || null
                ]
            );
        }

        // Commit transaction
        await client.query("COMMIT");

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });

    } catch (error) {
        // Rollback transaction on error
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    } finally {
        // Release client back to the pool
        client.release();
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and LEFT JOIN patient/doctor roles to grab their IDs
        const result = await pool.query(
            `
            SELECT 
                u.id, 
                u.email, 
                u.password_hash, 
                u.role, 
                u.first_name, 
                u.last_name,
                p.id AS patient_id,
                d.id AS doctor_id
            FROM users u
            LEFT JOIN patients p ON p.user_id = u.id
            LEFT JOIN doctors d ON d.user_id = u.id
            WHERE u.email = $1
            `,
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                patient_id: user.patient_id, // automatically null for admins/receptionists
                doctor_id: user.doctor_id    // automatically null for admins/receptionists
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};