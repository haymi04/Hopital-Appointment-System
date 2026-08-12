// server/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

const { protect, authorize } = require("../middleware/authMiddleware");
// Public or Protected routes depending on your auth middleware

// Anyone (even guests) can view the list of doctors:
router.get("/", doctorController.getAllDoctors);

// Only authenticated users with the role 'ADMIN' can add, edit, or delete doctors:
router.post("/", protect, authorize("ADMIN"), doctorController.addDoctor);
router.put("/:id", protect, authorize("ADMIN"), doctorController.updateDoctor);
router.delete("/:id", protect, authorize("ADMIN"), doctorController.deleteDoctor);

module.exports = router;