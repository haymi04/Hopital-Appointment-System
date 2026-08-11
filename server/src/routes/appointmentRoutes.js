const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");


router.post("/", createAppointment);

router.get("/", getAppointments);

router.put("/:id", updateAppointmentStatus);


module.exports = router;