const express = require("express");
const router = express.Router();

const pool = require("../db");

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});


router.post("/", async (req, res) => {

    try {

        const {
            patient_id,
            doctor_id,
            schedule_id,
            appointment_type
        } = req.body;


        const result = await pool.query(
            `INSERT INTO appointments
            (patient_id, doctor_id, schedule_id, appointment_type, status)
            VALUES ($1, $2, $3, $4, 'Pending')
            RETURNING *`,
            [
                patient_id,
                doctor_id,
                schedule_id,
                appointment_type
            ]
        );


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;