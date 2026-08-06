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


            // Get user from database
            const result = await pool.query(
                "SELECT id, email, role, first_name, last_name FROM users WHERE id = $1",
                [decoded.id]
            );


            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: "User not found"
                });
            }


            // Attach user to request
            req.user = result.rows[0];


            // Continue
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


module.exports = {
    protect
};