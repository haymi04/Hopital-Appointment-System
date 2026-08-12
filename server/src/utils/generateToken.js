const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            patient_id: user.patient_id || null, // Add patient_id if it exists
            doctor_id: user.doctor_id || null    // Add doctor_id if it exists
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;