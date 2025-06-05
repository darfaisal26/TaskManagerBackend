const taskService = require("../services/taskService");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { createTaskSchema } = require("../validators/taskValidator");

const createOrUpdateTask = asyncHandler(async (req, res) => {
  const validated = createTaskSchema.parse(req.body); // can also use update schema if different

  // Check for ID to determine create or update
  const taskId = validated.id;

  let task;

  if (taskId) {
    task = await taskService.updateTask(taskId, validated);
    return res.status(200).json({
      message: "Task updated successfully.",
      task,
    });
  }

  task = await taskService.createTask(validated);
  res.status(201).json({
    message: "Task created successfully.",
    task,
  });
});

const getMyTasks = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page, limit } = req.query;

  if (!page && !limit) {
    const tasks = await taskService.getAllTasksByUserId(userId);
    return res.json({
      totalItems: tasks.length,
      tasks,
    });
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  const { tasks, total } = await taskService.getTasksByUserId(
    userId,
    pageNum,
    limitNum
  );

  res.json({
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    tasks,
  });
});

const getAllTasks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  if (!page && !limit) {
    const tasks = await taskService.getAllTasksNoPagination();
    return res.json({
      totalItems: tasks.length,
      tasks,
    });
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  const { tasks, total } = await taskService.getAllTasks(pageNum, limitNum);

  res.json({
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    tasks,
  });
});

const getTasksByPriority = asyncHandler(async (req, res) => {
  const { priority } = req.query;
  if (!priority) {
    throw new AppError("Priority is required in query.", 404);
  }

  const tasks = await taskService.getTasksByPriority(priority.toLowerCase());
  res.json({ priority, count: tasks.length, tasks });
});

module.exports = {
  createOrUpdateTask,
  getMyTasks,
  getAllTasks,
  getTasksByPriority,
};
