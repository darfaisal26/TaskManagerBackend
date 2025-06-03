const taskService = require("../services/taskService");

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedToId } = req.body;
    const task = await taskService.createTask({
      title,
      description,
      assignedToId,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUserId(req.user.userId);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
