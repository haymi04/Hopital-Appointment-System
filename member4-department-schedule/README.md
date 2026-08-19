# Member 4 — Department & Schedule
Hospital Appointment Booking System | React + Node/Express + PostgreSQL

## What's inside

```
backend/
  config/db.js                 PostgreSQL connection pool
  middleware/auth.js            Temporary JWT middleware (swap for Member 1's)
  controllers/
    departments.controller.js   Department CRUD logic
    schedule.controller.js      Doctor schedule + available-slot logic
  routes/
    departments.routes.js
    schedule.routes.js
  migrations/schema.sql         Table definitions
  server.js                     Express app entry point
  package.json
  .env.example

frontend/
  src/services/
    departmentService.js        axios calls to /api/departments
    scheduleService.js          axios calls to /api/schedule
  src/components/
    ManageDepartments.jsx       Admin page
    MyAvailability.jsx          Doctor page
    AvailableTimes.jsx          Patient-facing slot picker
  package.json
```

## How to run it standalone (for your own testing)

1. **Create the database** (if you don't already have one from your team):
   ```
   createdb hospital_appointments
   ```
2. **Backend setup:**
   ```
   cd backend
   npm install
   cp .env.example .env      # fill in your real DB credentials
   ```
   You'll also need a minimal `doctors` table to satisfy the foreign keys, e.g.:
   ```sql
   CREATE TABLE doctors (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     department_id INTEGER
   );
   INSERT INTO doctors (name) VALUES ('Dr. Hana Tesfaye');
   ```
   Then run the migration:
   ```
   psql -d hospital_appointments -f migrations/schema.sql
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

3. **Frontend:** copy the `src/services` and `src/components` files into your
   team's shared React app (wherever `App.js` lives), then import and use:
   ```jsx
   import ManageDepartments from './components/ManageDepartments';
   import MyAvailability from './components/MyAvailability';
   import AvailableTimes from './components/AvailableTimes';
   ```
   Set `REACT_APP_API_URL` in a `.env` file at the frontend root if your
   backend isn't on `localhost:5000`.

## Integration notes for your teammates

- **Member 1 (Auth):** `backend/middleware/auth.js` is a working stub so you
  can test independently. Once their real middleware exists, swap the
  `require('../middleware/auth')` line in the route files for theirs — the
  interface (`req.user = { id, role }`) is designed to match.
- **Member 2 (Doctors):** ask them to add `department_id INTEGER REFERENCES
  departments(id)` to their `doctors` table.
- **Member 3 (Appointments):** `getAvailableSlots` in
  `schedule.controller.js` queries an `appointments` table with columns
  `doctor_id`, `appointment_date`, `appointment_time`, `status`. If their
  actual column names differ, update that one query — it's isolated at the
  bottom of the function. If the table doesn't exist yet, the endpoint
  degrades gracefully (returns an empty slot list with a warning) instead
  of crashing, so you can build ahead of them.

## API quick reference

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| GET | /api/departments | Public | List departments |
| GET | /api/departments/:id | Public | Get one department |
| POST | /api/departments | Admin | Create department |
| PUT | /api/departments/:id | Admin | Update department |
| DELETE | /api/departments/:id | Admin | Delete department |
| GET | /api/schedule/:doctorId | Public | Get a doctor's weekly schedule |
| GET | /api/schedule/:doctorId/slots?date=YYYY-MM-DD | Public | Get bookable time slots for a date |
| POST | /api/schedule | Doctor/Admin | Add a weekly availability block |
| PUT | /api/schedule/:id | Doctor/Admin | Update a block |
| DELETE | /api/schedule/:id | Doctor/Admin | Delete a block |
| POST | /api/schedule/override | Doctor/Admin | Add a day-off or special-hours override |
