const prisma = require("../config/db");

async function listSkills(req, res, next) {
  try {
    const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
    res.json(skills);
  } catch (err) {
    next(err);
  }
}

async function createSkill(req, res, next) {
  try {
    const { name, category, level, order } = req.body;
    if (!name) return res.status(400).json({ error: "Skill name is required." });

    const skill = await prisma.skill.create({
      data: {
        name,
        category: category || "General",
        level: level !== undefined ? Number(level) : 70,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
}

async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category, level, order } = req.body;
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(level !== undefined && { level: Number(level) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(skill);
  } catch (err) {
    next(err);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listSkills, createSkill, updateSkill, deleteSkill };
