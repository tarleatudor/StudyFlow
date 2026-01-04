import { prisma } from "../services/db.mjs";
import { getActivityStatus } from "../services/timeService.mjs";
import { catchAsync, AppError } from "../utils/errorHandler.mjs";

export const sendFeedback = catchAsync(async (req, res, next) => {
  const { code, emojiType } = req.body;

  // 1. Verificări rapide (fără DB)
  if (!code || !emojiType) return next(new AppError("Missing data", 400));

  // 2. Găsim activitatea (necesar pentru a ști în ce cameră emitem)
  const activity = await prisma.activity.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!activity) return next(new AppError("Not found", 404));

  const status = await getActivityStatus(activity.scheduledDate, activity.duration);
  if (status !== "ACTIVE") {
    return next(
      new AppError(
        "Nu se poate trimite feedback în afara intervalului orar.",
        403
      )
    );
  }

  // 3. Emiți pe Socket IMEDIAT (înainte de await prisma)
  const io = req.app.get("io");
  if (io) {
    io.to(`activity_${activity.id}`).emit("new_feedback", {
      id: Date.now(), // Adaugă un ID temporar pentru listele React
      emojiType,
      timestamp: new Date(),
    });
  }

  // 4. Salvarea în DB se face după ce socket-ul a plecat deja
  await prisma.feedback.create({
    data: { emojiType, activityId: activity.id },
  });

  res.status(201).json({ success: true });
});

//  get activity stats (real-time stats for professor)
export const getActivityStatsById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const stats = await prisma.feedback.findMany({
    where: { activityId: parseInt(id) },
    orderBy: { timestamp: "desc" }, // Sincronizat cu schema Prisma (timestamp)
  });

  res.json({ success: true, data: stats });
});
