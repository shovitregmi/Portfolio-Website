const { verifyToken } = require("../utils/jwt");

// Protects admin-only routes. Reads the JWT from an httpOnly cookie
// (falls back to an Authorization: Bearer header for API clients/tools like Postman).
function requireAuth(req, res, next) {
  const cookieName = process.env.COOKIE_NAME || "portfolio_token";
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.[cookieName] || bearer;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

module.exports = { requireAuth };
