// server/src/routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Anyone (even guests) can view departments — needed for the public
// "book an appointment" / department filter dropdowns.
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);

// Only ADMIN can create, edit, or delete departments.
router.post("/", protect, authorize("ADMIN"), departmentController.createDepartment);
router.put("/:id", protect, authorize("ADMIN"), departmentController.updateDepartment);
router.delete("/:id", protect, authorize("ADMIN"), departmentController.deleteDepartment);

module.exports = router;
