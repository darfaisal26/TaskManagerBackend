const authService = require("../services/authService");
const asyncHandler = require("express-async-handler");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);
  const user = await authService.registerUser(parsed);
  const { password, ...userWithoutPassword } = user;

  res.status(201).json({
    message: "User registered",
    user: userWithoutPassword,
  });
});

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);
  const token = await authService.loginUser(parsed);
  res.status(200).json({ token });
});

module.exports = { register, login };
