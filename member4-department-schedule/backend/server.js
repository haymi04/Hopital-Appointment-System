require('dotenv').config();
const express = require('express');
const cors = require('cors');

const departmentRoutes = require('./routes/departments.routes');
const scheduleRoutes = require('./routes/schedule.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount YOUR routes here. Other members will mount theirs the same way
// in this same file (e.g. app.use('/api/auth', authRoutes)).
app.use('/api/departments', departmentRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('Hospital Appointment Booking System API — Department & Schedule module running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
