const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadPatientPhoto } = require("../middleware/upload.middleware");

router.use(authMiddleware);

router.post("/", patientController.createPatient);
router.get("/", patientController.getAllPatients);
router.post(
  "/:id/photo",
  (req, res, next) => {
    uploadPatientPhoto.single("photo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message || "Erreur lors de l'upload de l'image",
        });
      }
      next();
    });
  },
  patientController.uploadPatientPhoto,
);
router.get("/:id", patientController.getPatientById);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

module.exports = router;
