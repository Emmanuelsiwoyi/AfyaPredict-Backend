
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const sendSMS = require("../sms");
const { body, validationResult } = require("express-validator");

// Get all appointments
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        appointments.id,
        patients.first_name,
        patients.last_name,
        doctors.first_name AS doctor_first_name,
        doctors.last_name AS doctor_last_name,
        appointments.appointment_date,
        appointments.appointment_time,
        appointments.clinic,
        appointments.status
      FROM appointments
      JOIN patients
        ON appointments.patient_id = patients.id
      LEFT JOIN doctors
        ON appointments.doctor_id = doctors.id
      ORDER BY appointments.id;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching appointments");
  }
});

// Book an appointment
router.post(
  "/",
  auth,
  [
    body("patient_id").notEmpty().withMessage("Patient ID is required"),
    body("doctor_id").notEmpty().withMessage("Doctor ID is required"),
    body("appointment_date")
      .notEmpty()
      .withMessage("Appointment date is required")
      .isISO8601()
      .withMessage("Invalid date"),
    body("appointment_time")
      .notEmpty()
      .withMessage("Appointment time is required"),
    body("clinic").notEmpty().withMessage("Clinic is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      clinic
    } = req.body;

    try {
        // Check if patient exists
const patient = await db.query(
  "SELECT id FROM patients WHERE id = $1",
  [patient_id]
);

if (patient.rows.length === 0) {
  return res.status(404).json({
    message: "Patient not found"
  });
}

// Check if doctor exists
const doctor = await db.query(
  "SELECT id FROM doctors WHERE id = $1",
  [doctor_id]
);

if (doctor.rows.length === 0) {
  return res.status(404).json({
    message: "Doctor not found"
  });
}// Check if the doctor is already booked
const existingAppointment = await db.query(
  `SELECT id
   FROM appointments
   WHERE doctor_id = $1
     AND appointment_date = $2
     AND appointment_time = $3`,
  [doctor_id, appointment_date, appointment_time]
);

if (existingAppointment.rows.length > 0) {
  return res.status(409).json({
    message: "Doctor is already booked for this date and time"
  });
}
      const result = await db.query(
        `INSERT INTO appointments
        (patient_id, doctor_id, appointment_date, appointment_time, clinic)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [patient_id, doctor_id, appointment_date, appointment_time, clinic]
      );

  await sendSMS(
  "+254793474947",
  `Your appointment at ${clinic} has been booked successfully for ${appointment_date} at ${appointment_time}.`
);

res.status(201).json(result.rows[0]);

} catch (error) {
  console.error(error);
  res.status(500).send("Error booking appointment");
}
});
router.patch("/:id/status", auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment status updated successfully",
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating appointment status");
  }
});
// Delete an appointment
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting appointment");
  }
});
module.exports = router;