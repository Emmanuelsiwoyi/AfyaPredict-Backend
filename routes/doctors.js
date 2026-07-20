
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM doctors ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching doctors");
  }
});

// Add a doctor
router.post("/", async (req, res) => {
  const { first_name, last_name, specialization, phone, email } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO doctors
      (first_name, last_name, specialization, phone, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [first_name, last_name, specialization, phone, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding doctor");
  }
});

module.exports = router;