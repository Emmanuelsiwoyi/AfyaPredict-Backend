
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
  const { full_name, specialization, phone, email } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO doctors
      (full_name, specialization, phone, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [full_name, specialization, phone, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding doctor");
  }
});

// Delete a doctor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM doctors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      message: "Doctor deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting doctor");
  }
});
module.exports = router;