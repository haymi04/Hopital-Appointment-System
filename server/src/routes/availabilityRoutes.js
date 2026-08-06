// server/src/routes/availabilityRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDoctorAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
} = require('../controllers/availabilityController');

router.get('/doctor/:doctorId', getDoctorAvailability);
router.post('/', addAvailabilitySlot);
router.delete('/:id', deleteAvailabilitySlot);

module.exports = router;