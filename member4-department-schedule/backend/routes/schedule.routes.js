const express = require('express');
const router = express.Router();
const {
  getDoctorSchedule,
  addAvailabilityBlock,
  updateAvailabilityBlock,
  deleteAvailabilityBlock,
  addOverride,
  getAvailableSlots,
} = require('../controllers/schedule.controller');
const { requireDoctorOrAdmin } = require('../middleware/auth');

// Public - patients need to see a doctor's schedule/slots to book
router.get('/:doctorId', getDoctorSchedule);
router.get('/:doctorId/slots', getAvailableSlots);

// Doctor (or admin) manages the recurring weekly schedule
router.post('/', requireDoctorOrAdmin, addAvailabilityBlock);
router.put('/:id', requireDoctorOrAdmin, updateAvailabilityBlock);
router.delete('/:id', requireDoctorOrAdmin, deleteAvailabilityBlock);

// One-off overrides
router.post('/override', requireDoctorOrAdmin, addOverride);

module.exports = router;
