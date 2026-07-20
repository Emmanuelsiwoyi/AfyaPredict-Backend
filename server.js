
require("dotenv").config();



const express = require("express");
const db = require("./db");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const userRoutes = require("./routes/users");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", userRoutes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.send(`Database connected! Current time: ${result.rows[0].now}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});