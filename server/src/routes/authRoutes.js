const express = require("express");
const router = express.Router();

const pool = require("../config/database");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

// Get logged-in user's complete profile
router.get("/profile", protect, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.role,
                p.id AS patient_id,
                d.id AS doctor_id
            FROM users u
            LEFT JOIN patients p ON p.user_id = u.id
            LEFT JOIN doctors d ON d.user_id = u.id
            WHERE u.id = $1
            `,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
});

// Role
router.get(
    "/admin-test",
    protect,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin",
            user: req.user
        });
    }
);

module.exports = router;