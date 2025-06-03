const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/authMiddleware");

router.post("/", isAuthenticated, taskController.createTask);
router.get("/my", isAuthenticated, taskController.getMyTasks);
router.get(
  "/all",
  isAuthenticated,
  requireRole("admin", "manager"),
  taskController.getAllTasks
);

module.exports = router;
