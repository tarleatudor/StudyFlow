import { prisma } from "../services/db.mjs";
import { generateUniqueCode } from "../services/activityService.mjs";
import { getActivityStatus } from "../services/timeService.mjs";
import { catchAsync, AppError } from "../utils/errorHandler.mjs";

//create new activity (professor)

export const createActivity = catchAsync(async (req, res, next) => {
  const { title, description, duration, scheduledAt } = req.body;
  const teacherId = req.user.id;

  if (!title || !duration) {
    return next(new AppError("Titlul și durata sunt obligatorii", 400));
  }

  const code = await generateUniqueCode();

  // Măsură de siguranță: folosim scheduledAt din body sau data curentă
  const finalDate = scheduledAt ? new Date(scheduledAt) : new Date();

  const activity = await prisma.activity.create({
    data: {
      title,
      description,
      duration: parseInt(duration),
      teacherId: parseInt(teacherId),
      code: code.toUpperCase(),
      scheduledDate: finalDate, // Sincronizat cu schema Prisma
    },
  });

  res.status(201).json({ success: true, data: activity });
});

//list all activities (for professor Dashboard)

export const getAllActivities = catchAsync(async (req, res) => {
  // În middleware-ul tău protect, probabil ai stocat id-ul în req.user.id
  const teacherId = req.user.id;

  const activities = await prisma.activity.findMany({
    where: { teacherId: teacherId },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: activities,
  });
});

export const getActivityByCode = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const activity = await prisma.activity.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!activity) return next(new AppError("Activity not found", 404));

  const status = await getActivityStatus(activity.scheduledDate, activity.duration);

  res.status(200).json({
    success: true,
    data: {
      id: activity.id,
      title: activity.title,
      status: status,
      scheduledDate: activity.scheduledDate,
      isActive: status === "ACTIVE",
    },
  });
});

export const getActivityById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const activity = await prisma.activity.findUnique({
    where: { id: Number(id) },
  });

  if (!activity) return next(new AppError("Activity not found", 404));

  // Folosim scheduledDate conform schemei pentru a verifica dacă e activă
  const active = await getActivityStatus(
    activity.scheduledDate,
    activity.duration
  );

  res.status(200).json({
    success: true,
    data: {
      id: activity.id,
      title: activity.title,
      code: activity.code,
      isActive: active,
    },
  });
});

export const deleteActivityById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const activity = await prisma.activity.findUnique({
    where: { id: parseInt(id) },
  });

  if (!activity) {
    return next(new AppError("Activitatea nu a fost găsită.", 404));
  }

  // Verificăm dacă profesorul care cere ștergerea este stăpânul activității
  if (activity.teacherId !== userId) {
    return next(
      new AppError("Nu aveți permisiunea de a șterge această resursă.", 403)
    );
  }

  await prisma.activity.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    success: true,
    message: "Activitatea și feedback-urile asociate au fost șterse.",
  });
});
