const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });
  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return token;
};
