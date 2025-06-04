const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password, role = "user" }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const roleRecord = await prisma.role.findUnique({
    where: { name: role },
  });

  if (!roleRecord) {
    throw new Error(`Role '${role}' does not exist`);
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
  if (!user) throw new Error("user with this email does not exist");

  if (user.password !== password) {
    throw new Error("Password does not match");
  }
  // const valid = await bcrypt.compare(password, user.password);
  // console.log(valid, "valid");
  // if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

module.exports = { registerUser, loginUser };
