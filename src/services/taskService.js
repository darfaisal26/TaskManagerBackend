const prisma = require("../prisma/client");

exports.createTask = async ({
  title,
  description,
  assignedToId,
  priority,
  dueDate,
}) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      assignedToId,
      priority,
      dueDate,
    },
  });
};

exports.getTasksByUserId = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: { assignedToId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({
      where: { assignedToId: userId },
    }),
  ]);

  return { tasks, total };
};

// Fetch all tasks for a user - no pagination
exports.getAllTasksByUserId = async (userId) => {
  return await prisma.task.findMany({
    where: { assignedToId: userId },
    orderBy: { createdAt: "desc" },
  });
};

// Paginated all tasks for admins
exports.getAllTasks = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { assignedTo: true },
    }),
    prisma.task.count(),
  ]);

  return { tasks, total };
};

// Fetch all tasks for admins - no pagination
exports.getAllTasksNoPagination = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedTo: true },
  });
};


