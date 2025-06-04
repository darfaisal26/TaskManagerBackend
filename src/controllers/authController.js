const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json({
      message: "User registered",
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ token });
  } catch (err) {
    console.log(err, "in login");
    res.status(400).json({ error: err.message });
  }
};
