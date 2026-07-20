
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();
router.post(
  "/register",
  [
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["Admin", "Doctor", "Receptionist", "Patient"])
      .withMessage("Invalid role")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, password, role } = req.body;

    try {
      // Check if email already exists
      const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          message: "Email already exists"
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user
      const result = await db.query(
        `INSERT INTO users
        (full_name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, email, role`,
        [full_name, email, hashedPassword, role]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error registering user");
    }
  }
);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed");
  }
});
module.exports = router;