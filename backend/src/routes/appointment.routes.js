const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.createAppointment);
router.get("/", controller.getAllAppointments);
router.get("/:id", controller.getAppointmentById);
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;
