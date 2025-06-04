const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const registerUser = async ({ name, email, password, role = "user" }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("User with this email already exists", 409);
  }

  const roleRecord = await prisma.role.findUnique({
    where: { name: role },
  });

  if (!roleRecord) {
    throw new AppError(`Role '${role}' does not exist`, 400);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: password,
      roleId: roleRecord.id,
    },
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("user with this email does not exist", 400);

  if (user.password !== password) {
    throw new AppError("Password does not match", 401);
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

module.exports = { registerUser, loginUser };
