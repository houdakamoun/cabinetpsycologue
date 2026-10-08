const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.createPayment);
router.get("/", controller.getAllPayments);
router.put("/:id", controller.updatePayment);
router.delete("/:id", controller.deletePayment);

module.exports = router;
