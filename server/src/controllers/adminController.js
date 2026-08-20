const pool = require("../config/database");

const getDashboardStats = async (req, res) => {
    try {
        const doctorCount = await pool.query("SELECT COUNT(*) FROM doctors");
        const patientCount = await pool.query("SELECT COUNT(*) FROM patients");
        const appointmentCount = await pool.query("SELECT COUNT(*) FROM appointments");
        const departmentCount = await pool.query("SELECT COUNT(*) FROM departments");

        res.json({
            doctors: parseInt(doctorCount.rows[0].count),
            patients: parseInt(patientCount.rows[0].count),
            appointments: parseInt(appointmentCount.rows[0].count),
            departments: parseInt(departmentCount.rows[0].count)
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

module.exports = { getDashboardStats };