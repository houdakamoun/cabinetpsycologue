const prisma = require("../prisma/client");

exports.createPayment = async (req, res) => {
  try {
    const { patientId, appointmentId, amount, status, notes } = req.body;

    const payment = await prisma.payment.create({
      data: {
        patientId: parseInt(patientId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        amount: parseFloat(amount),
        status: status || "UNPAID",
        paidAt: status === "PAID" ? new Date() : null,
        notes,
      },
      include: { patient: true, appointment: true },
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (patientId) where.patientId = parseInt(patientId);

    const payments = await prisma.payment.findMany({
      where,
      include: { patient: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.amount) data.amount = parseFloat(data.amount);
    if (data.status === "PAID" && !data.paidAt) {
      data.paidAt = new Date();
    }

    const payment = await prisma.payment.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { patient: true, appointment: true },
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await prisma.payment.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
