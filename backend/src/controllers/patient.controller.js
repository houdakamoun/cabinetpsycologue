const prisma = require("../prisma/client");
const fs = require("fs");
const path = require("path");

function sanitizePatientData(body) {
  const data = {
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    phone: body.phone?.trim(),
    email: body.email?.trim() || null,
    address: body.address?.trim() || null,
    notes: body.notes?.trim() || null,
  };
  if (body.birthDate) {
    const birth = new Date(body.birthDate);
    if (!isNaN(birth.getTime())) {
      data.birthDate = birth;
      const today = new Date();
      data.age = today.getFullYear() - birth.getFullYear();
    }
  }

  if (body.age != null && body.age !== "") {
    data.age = parseInt(body.age, 10);
  }

  return data;
}

exports.createPatient = async (req, res) => {
  try {
    const data = sanitizePatientData(req.body);

    if (!data.firstName || !data.lastName || !data.phone) {
      return res.status(400).json({
        error: "Le prénom, le nom et le téléphone sont obligatoires",
      });
    }

    const patient = await prisma.patient.create({ data });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        appointments: { orderBy: { startTime: "desc" } },
        sessionNotes: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient introuvable" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const data = sanitizePatientData(req.body);
    const patient = await prisma.patient.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.patient.findUnique({ where: { id } });

    if (existing?.photo?.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../..", existing.photo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.patient.delete({ where: { id } });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadPatientPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Veuillez sélectionner une image (PNG, JPEG ou JPG)" });
    }

    const id = parseInt(req.params.id);
    const existing = await prisma.patient.findUnique({ where: { id } });

    if (!existing) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Patient introuvable" });
    }

    if (existing.photo?.startsWith("/uploads/")) {
      const oldPath = path.join(__dirname, "../..", existing.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const photoPath = `/uploads/patients/${req.file.filename}`;
    const patient = await prisma.patient.update({
      where: { id },
      data: { photo: photoPath },
    });

    res.json(patient);
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
};