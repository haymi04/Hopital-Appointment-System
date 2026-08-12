const authService = require("../services/authService");

// POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const user = await authService.registerPatient(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(error.message === "Email already exists" ? 400 : 500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            ...data
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(error.message === "Invalid email or password" ? 401 : 500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};