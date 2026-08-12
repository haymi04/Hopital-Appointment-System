const jwt = require("jsonwebtoken");


const protect = async (req, res, next) => {
    let token;

    try {
        // 1. Check if Authorization header exists and starts with "Bearer"
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

             // 3. Attach the decoded payload (including patient_id / doctor_id) directly to req.user
            req.user = {
                id: decoded.id,
                role: decoded.role,
                patient_id: decoded.patient_id,
                doctor_id: decoded.doctor_id
            };
            // Continue to the next route/controller handler
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