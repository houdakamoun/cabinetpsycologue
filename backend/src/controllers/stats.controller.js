const prisma = require("../prisma/client");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalPatients,
      todayAppointments,
      completedSessions,
      monthlyRevenue,
      pendingAppointments,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count({
        where: {
          startTime: { gte: today, lt: tomorrow },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.appointment.count({
        where: { status: "COMPLETED" },
      }),
      prisma.payment.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.appointment.count({
        where: { status: "PENDING" },
      }),
    ]);

    const todayList = await prisma.appointment.findMany({
      where: {
        startTime: { gte: today, lt: tomorrow },
        status: { not: "CANCELLED" },
      },
      include: { patient: true },
      orderBy: { startTime: "asc" },
    });

    res.json({
      totalPatients,
      todayAppointments,
      completedSessions,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      pendingAppointments,
      todayList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
