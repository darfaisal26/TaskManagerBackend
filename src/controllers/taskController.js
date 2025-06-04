const taskService = require("../services/taskService");
const { createTaskSchema } = require("../validators/taskValidator");
const { formatZodError } = require("../utils/formattedError");

const createTask = async (req, res) => {
  try {
    // const { title, description, assignedToId, priority, dueDate } = req.body;
    // console.log("validated", validated);
    const validated = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(validated);
    res.status(201).json(task);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        errors: formatZodError(err),
      });
    }
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getMyTasks = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const getAllTasks = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.query;
    console.log(priority, "priorty");
    if (!priority) {
      return res.status(400).json({ error: "Priority is required in query." });
    }

    const tasks = await taskService.getTasksByPriority(priority.toLowerCase());

    res.json({ priority, count: tasks.length, tasks });
  } catch (err) {
    console.error("Error fetching tasks by priority:", err);
    res.status(500).json({ error: "Failed to fetch tasks by priority." });
  }
};

module.exports = { createTask, getMyTasks, getAllTasks, getTasksByPriority };
