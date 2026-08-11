const prisma = require("../config/db");

async function listExperiences(req, res, next) {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    res.json(experiences);
  } catch (err) {
    next(err);
  }
}

async function createExperience(req, res, next) {
  try {
    const {
      company,
      position,
      location,
      startDate,
      endDate,
      current,
      description,
      technologies,
      companyUrl,
      order,
    } = req.body;

    if (!company || !position || !startDate) {
      return res
        .status(400)
        .json({ error: "Company, position, and start date are required." });
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: Boolean(current),
        description: description || "",
        technologies: Array.isArray(technologies) ? technologies : [],
        companyUrl: companyUrl || null,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json(experience);
  } catch (err) {
    next(err);
  }
}

async function updateExperience(req, res, next) {
  try {
    const id = Number(req.params.id);
    const {
      company,
      position,
      location,
      startDate,
      endDate,
      current,
      description,
      technologies,
      companyUrl,
      order,
    } = req.body;

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(company !== undefined && { company }),
        ...(position !== undefined && { position }),
        ...(location !== undefined && { location: location || null }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
        ...(current !== undefined && { current: Boolean(current) }),
        ...(description !== undefined && { description }),
        ...(technologies !== undefined && {
          technologies: Array.isArray(technologies) ? technologies : [],
        }),
        ...(companyUrl !== undefined && { companyUrl: companyUrl || null }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(experience);
  } catch (err) {
    next(err);
  }
}

async function deleteExperience(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.experience.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
