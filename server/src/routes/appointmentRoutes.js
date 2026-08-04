const express = require("express");
const router = express.Router();
const pool = require("../config/database");


router.get("/", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM appointments ORDER BY id ASC"
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: error.message
        });

    }
});

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

const allowedStatus = ["Pending", "Confirmed", "Cancelled"];

if (!allowedStatus.includes(status)) {
    return res.status(400).json({
        message: "Invalid status"
    });
}
        const result = await pool.query(
            `UPDATE appointments
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );


        res.status(200).json(result.rows[0]);


    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: error.message
        });

    }

});

router.post("/", async (req, res) => {
    try {

        const {
            patient_id,
            doctor_id,
            schedule_id,
            appointment_type
        } = req.body;

        console.log(req.body);

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
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;