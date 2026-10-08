const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionNote.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.createSessionNote);
router.get("/patient/:patientId", controller.getNotesByPatient);
router.put("/:id", controller.updateSessionNote);
router.delete("/:id", controller.deleteSessionNote);

module.exports = router;
