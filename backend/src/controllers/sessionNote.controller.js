const prisma = require("../prisma/client");

exports.createSessionNote = async (req, res) => {
  try {
    const { patientId, appointmentId, content, isPrivate } = req.body;

    const note = await prisma.sessionNote.create({
      data: {
        patientId: parseInt(patientId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        content,
        isPrivate: isPrivate !== false,
      },
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotesByPatient = async (req, res) => {
  try {
    const notes = await prisma.sessionNote.findMany({
      where: { patientId: parseInt(req.params.patientId) },
      include: { appointment: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSessionNote = async (req, res) => {
  try {
    const note = await prisma.sessionNote.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSessionNote = async (req, res) => {
  try {
    await prisma.sessionNote.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Note supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
