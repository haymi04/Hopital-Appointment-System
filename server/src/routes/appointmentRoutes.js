const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createAppointment);

router.get("/", protect, getAppointments);

router.put("/:id", protect, updateAppointmentStatus);


module.exports = router;