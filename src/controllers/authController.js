const authService = require("../services/authService");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { formatZodError } = require("../utils/formattedError");

const register = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body); // will throw an error if it is  invalid handled in catch block
    // const { name, email, password, role } = parsed;
    const user = await authService.registerUser(parsed);

    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered",
      user: userWithoutPassword,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        issues: formatZodError(err),
      });
    }
    console.error("Register error:", err.message);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body); // will throw an error if it is  invalid handled in catch block
    const token = await authService.loginUser(parsed);
    res.status(200).json({ token });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        issues: formatZodError(err),
      });
    }

    console.error("Login error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
