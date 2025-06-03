const prisma = require("../prisma/client");

exports.createTask = async ({ title, description, assignedToId }) => {
  return await prisma.task.create({
    data: { title, description, assignedToId },
  });
};

exports.getTasksByUserId = async (userId) => {
  return await prisma.task.findMany({
    where: { assignedToId: userId },
  });
};

exports.getAllTasks = async () => {
  return await prisma.task.findMany({
    include: { assignedTo: true },
  });
};
