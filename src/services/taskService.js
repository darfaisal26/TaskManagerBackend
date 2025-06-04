const prisma = require("../prisma/client");

const createTask = async ({
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

// with pagination
const getTasksByUserId = async (userId, page, limit) => {
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

// without pagination
const getAllTasksByUserId = async (userId) => {
  return await prisma.task.findMany({
    where: { assignedToId: userId },
    orderBy: { createdAt: "desc" },
  });
};

// with pagination
const getAllTasks = async (page, limit) => {
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
// without pagination
const getAllTasksNoPagination = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedTo: true },
  });
};

const getTasksByPriority = async (priority) => {
  return await prisma.task.findMany({
    where: {
      priority: priority,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignedTo: true,
    },
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getAllTasksByUserId,
  getTasksByUserId,
  getAllTasksNoPagination,
  getTasksByPriority,
};
