const taskService = require("../services/taskService");

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedToId, priority, dueDate } = req.body;

    const task = await taskService.createTask({
      title,
      description,
      assignedToId,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;

    if (!page && !limit) {
      // Return all tasks (no pagination)
      const tasks = await taskService.getAllTasksByUserId(userId);
      return res.json({
        totalItems: tasks.length,
        tasks,
      });
    }

    // Parse pagination params with defaults
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

exports.getAllTasks = async (req, res) => {
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






