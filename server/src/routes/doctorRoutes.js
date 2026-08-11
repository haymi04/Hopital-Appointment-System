// server/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// Public or Protected routes depending on your auth middleware
router.get("/", doctorController.getAllDoctors);
router.post("/", doctorController.addDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;