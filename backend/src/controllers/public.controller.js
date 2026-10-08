const prisma = require("../prisma/client");

exports.registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, birthDate, address } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !phone?.trim()) {
      return res.status(400).json({
        error: "Le prénom, le nom et le téléphone sont obligatoires",
      });
    }

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      address: address?.trim() || null,
    };

    if (birthDate) {
      const birth = new Date(birthDate);
      data.birthDate = birth;
      const today = new Date();
      data.age = today.getFullYear() - birth.getFullYear();
    }

    const patient = await prisma.patient.create({ data });

    res.status(201).json({
      message: "Inscription enregistrée avec succès",
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
