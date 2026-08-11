const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const protect = async (req, res, next) => {
    let token;

    try {
        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Get user from database with role-specific IDs (LEFT JOINing patients and doctors)
            const result = await pool.query(
                `
                SELECT 
                    u.id, 
                    u.email, 
                    u.role, 
                    u.first_name, 
                    u.last_name,
                    p.id AS patient_id,
                    d.id AS doctor_id
                FROM users u
                LEFT JOIN patients p ON p.user_id = u.id
                LEFT JOIN doctors d ON d.user_id = u.id
                WHERE u.id = $1
                `,
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            // Attach user details (including patient_id / doctor_id) to the request object
            req.user = result.rows[0];

            // Continue to the next route handler
            next();
        } else {
            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired"
            });
        }
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

// Role authorization middleware
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this resource`
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};