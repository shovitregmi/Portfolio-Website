const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { signToken } = require("../utils/jwt");

const cookieName = () => process.env.COOKIE_NAME || "portfolio_token";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
    res.cookie(cookieName(), token, cookieOptions());

    res.json({ id: admin.id, name: admin.name, email: admin.email });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.clearCookie(cookieName(), { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true });
}

async function me(req, res, next) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, name: true, email: true },
    });
    if (!admin) return res.status(404).json({ error: "Admin not found." });
    res.json(admin);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };
