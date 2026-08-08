const express = require("express");
const rateLimit = require("express-rate-limit");
const { createMessage, listMessages, markRead, deleteMessage } = require("../controllers/messageController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Prevent the public contact form from being used to spam the DB
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: "Too many messages sent. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, createMessage);
router.get("/", requireAuth, listMessages);
router.patch("/:id", requireAuth, markRead);
router.delete("/:id", requireAuth, deleteMessage);

module.exports = router;
