const express = require("express");
const pool = require("./server/src/config/database");

const app = express();
const appointmentRoutes = require("./server/src/routes/appointmentRoutes");
const appointmentController = require("./server/src/controllers/appointmentController");
app.use(express.json());
app.use("/appointments", appointmentRoutes);


app.get("/", (req, res) => {
    res.send("Hospital Appointment API Running");
});

pool.connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed", error);
    });


app.listen(5000, () => {
    console.log("Server running on port 5000");
});