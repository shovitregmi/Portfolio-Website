// Catches errors thrown/passed via next(err) in any route and returns a clean JSON response.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    // Prisma unique constraint violation
    return res.status(409).json({ error: `A record with that ${err.meta?.target?.join(", ")} already exists.` });
  }

  if (err.code === "P2025") {
    // Prisma "record not found"
    return res.status(404).json({ error: "Record not found." });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong on the server." });
}

function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
}

module.exports = { errorHandler, notFound };
