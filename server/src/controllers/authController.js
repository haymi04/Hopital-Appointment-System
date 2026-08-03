const pool = require("../config/database");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");


// Register User
const registerUser = async (req, res) => {

    try {

        const {
            email,
            password,
            role,
            first_name,
            last_name,
            phone,
            gender,
            date_of_birth
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


        // Insert user into database
        const newUser = await pool.query(
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
            ($1,$2,$3,$4,$5,$6,$7,$8)
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


    const user = newUser.rows[0];
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

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

//Login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
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
                last_name: user.last_name
            }
        });

    } catch (error) {

        console.log(error);

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

