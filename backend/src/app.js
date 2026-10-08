const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const paymentRoutes = require("./routes/payment.routes");
const sessionNoteRoutes = require("./routes/sessionNote.routes");
const statsRoutes = require("./routes/stats.routes");
const publicRoutes = require("./routes/public.routes");

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/session-notes", sessionNoteRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("Psychology Cabinet API is running...");
});

module.exports = app;
