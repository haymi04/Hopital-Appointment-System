const pool = require("../config/database");


// POST /appointments
exports.createAppointment = async (req, res) => {
  try {

    const {
  doctor_id,
  appointment_date,
  appointment_time,
  reason
} = req.body;

const patient_id = req.user.patient_id;
const created_by_user_id = req.user.id;


    const result = await pool.query(
      `INSERT INTO appointments
      (
        patient_id,
        doctor_id,
        created_by_user_id,
        appointment_date,
        appointment_time,
        status,
        reason
      )

      VALUES ($1,$2,$3,$4,$5,'APPROVED',$6)

      RETURNING *`,

      [
        patient_id,
        doctor_id,
        created_by_user_id,
        appointment_date,
        appointment_time,
        reason
      ]
    );


    res.status(201).json(result.rows[0]);


  } catch(error){

    console.log(error);
    res.status(500).json({
      message:error.message
    });

  }
};




// GET /appointments
exports.getAppointments = async (req,res)=>{

 try{

 const result = await pool.query(
   `SELECT *
    FROM appointments 
    WHERE patient_id = $1 
    ORDER BY appointment_date, appointment_time`,
    [req.user.patient_id]

 );


 res.json(result.rows);


 }catch(error){

 console.log(error);

 res.status(500).json({
 message:error.message
 });

 }

};




// PUT /appointments/:id
exports.updateAppointmentStatus = async(req,res)=>{

try{

const {status}=req.body;

const result = await pool.query(

`UPDATE appointments
SET status=$1
WHERE id=$2
RETURNING *`,

[status, req.params.id]

);


res.json(result.rows[0]);


}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

};

// GET /appointments/doctor
// Get appointments for the logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    if (!req.user.doctor_id) {
      return res.status(400).json({
        message: "Doctor ID not found"
      });
    }

    const result = await pool.query(
      `SELECT
        a.id,
        a.patient_id,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.reason,

        u.first_name AS patient_first_name,
        u.last_name AS patient_last_name,
        u.phone AS patient_phone

       FROM appointments a

       JOIN patients p
         ON a.patient_id = p.id

       JOIN users u
         ON p.user_id = u.id

       WHERE a.doctor_id = $1

       ORDER BY
         a.appointment_date ASC,
         a.appointment_time ASC`,
      [req.user.doctor_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};