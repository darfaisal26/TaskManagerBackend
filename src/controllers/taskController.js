const taskService = require("../services/taskService");
const AppError = require("../utils/AppError");
const { createTaskSchema } = require("../validators/taskValidator");
const asyncHandler = require("express-async-handler");

const createTask = asyncHandler(async (req, res) => {
  const validated = createTaskSchema.parse(req.body);
  const task = await taskService.createTask(validated);
  res.status(201).json(task);
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
  // try {
  // } catch (err) {
  //   console.error("Error fetching tasks:", err);
  //   res.status(500).json({ error: "Failed to fetch tasks" });
  // }
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
  // try {
  // } catch (err) {
  //   console.error("Error fetching all tasks:", err);
  //   res.status(500).json({ error: "Internal server error" });
  // }
});

const getTasksByPriority = asyncHandler(async (req, res) => {
  const { priority } = req.query;
  if (!priority) {
    throw new AppError("Priority is required in query.", 404);
  }

  const tasks = await taskService.getTasksByPriority(priority.toLowerCase());
  res.json({ priority, count: tasks.length, tasks });
  // try {
  // } catch (err) {
  //   console.error("Error fetching tasks by priority:", err);
  //   res.status(500).json({ error: "Failed to fetch tasks by priority." });
  // }
});

module.exports = { createTask, getMyTasks, getAllTasks, getTasksByPriority };
