const prisma = require("../config/db");

async function createMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const saved = await prisma.message.create({
      data: { name, email, subject: subject || null, message },
    });

    res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    next(err);
  }
}

async function listMessages(req, res, next) {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const message = await prisma.message.update({
      where: { id },
      data: { read: read !== undefined ? Boolean(read) : true },
    });
    res.json(message);
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.message.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMessage, listMessages, markRead, deleteMessage };
