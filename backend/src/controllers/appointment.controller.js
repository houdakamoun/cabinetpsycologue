const prisma = require("../prisma/client");

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, startTime, endTime, status, notes, color, price } =
      req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: status || "PENDING",
        notes,
        color: color || "#099078",
        price: price ? parseFloat(price) : 60,
      },
      include: { patient: true },
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { start, end, status } = req.query;
    const where = {};

    if (start && end) {
      where.startTime = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: true, payment: true },
      orderBy: { startTime: "asc" },
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { patient: true, payment: true, sessionNotes: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.patientId) data.patientId = parseInt(data.patientId);
    if (data.startTime) data.startTime = new Date(data.startTime);
    if (data.endTime) data.endTime = new Date(data.endTime);
    if (data.price) data.price = parseFloat(data.price);

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { patient: true },
    });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await prisma.appointment.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Rendez-vous supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
