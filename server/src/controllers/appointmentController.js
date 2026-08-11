const pool = require("../config/database");


// POST /appointments
exports.createAppointment = async (req, res) => {
  try {

    const {
      patient_id,
      doctor_id,
      created_by_user_id,
      appointment_date,
      appointment_time,
      reason
    } = req.body;


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

      VALUES ($1,$2,$3,$4,$5,'PENDING',$6)

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
   "SELECT * FROM appointments ORDER BY id"
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