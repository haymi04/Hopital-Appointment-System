const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departments.controller');
const { requireAdmin } = require('../middleware/auth');

// Public - anyone browsing doctors/departments can see this list
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

// Admin-only
router.post('/', requireAdmin, createDepartment);
router.put('/:id', requireAdmin, updateDepartment);
router.delete('/:id', requireAdmin, deleteDepartment);

module.exports = router;
