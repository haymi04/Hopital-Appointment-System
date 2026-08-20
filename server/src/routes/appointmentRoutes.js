const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
   getDoctorAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

router.post("/", createAppointment);

router.get("/", getAppointments);
router.get(
  "/doctor",
  protect,
  authorize("DOCTOR"),
  getDoctorAppointments
);

router.put("/:id", updateAppointmentStatus);



module.exports = router;