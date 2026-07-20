
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM patients ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching patients");
  }
});
router.post(
  "/",
  [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Please enter a valid email")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { first_name, last_name, gender, phone, email } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO patients
        (first_name, last_name, gender, phone, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [first_name, last_name, gender, phone, email]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error adding patient");
    }
  }
);
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, gender, phone, email } = req.body;

  try {
    const result = await db.query(
      `UPDATE patients
       SET first_name = $1,
           last_name = $2,
           gender = $3,
           phone = $4,
           email = $5
       WHERE id = $6
       RETURNING *`,
      [first_name, last_name, gender, phone, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Patient not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient");
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Patient not found");
    }

    res.json({
      message: "Patient deleted successfully",
      patient: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting patient");
  }
});
module.exports = router;