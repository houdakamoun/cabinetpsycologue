const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../../uploads/patients");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const patientId = req.params.id || "new";
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png"].includes(ext) ? ext : ".jpg";
    cb(null, `patient-${patientId}-${Date.now()}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format accepté : PNG, JPEG ou JPG uniquement"), false);
  }
};

const uploadPatientPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

module.exports = { uploadPatientPhoto, uploadsDir };
