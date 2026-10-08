const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.controller");

router.post("/register-patient", publicController.registerPatient);

module.exports = router;
