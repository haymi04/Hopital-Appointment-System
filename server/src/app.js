// server/src/app.js
require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const appointmentRoutes = require("./routes/appointmentRoutes");//import appointment routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/departments", departmentRoutes);

// Health check route
app.use("/api/appointments", appointmentRoutes);//connect appointment routes
console.log("Appointment routes loaded");

app.get("/", (req, res) => {
    res.send("Hospital API is running");
});

// Database Connection Test
pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});