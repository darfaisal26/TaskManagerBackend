const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  assignedToId: z.number().int().positive("AssignedToId must be a valid user ID"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  dueDate: z.coerce.date().optional(), // Accepts date strings like "2025-06-11"
});

module.exports = {
  createTaskSchema,
};
