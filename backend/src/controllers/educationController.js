const prisma = require("../config/db");

async function listEducation(req, res, next) {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    res.json(education);
  } catch (err) {
    next(err);
  }
}

async function createEducation(req, res, next) {
  try {
    const {
      institution,
      degree,
      fieldOfStudy,
      location,
      startDate,
      endDate,
      current,
      description,
      order,
    } = req.body;

    if (!institution || !degree) {
      return res
        .status(400)
        .json({ error: "Institution and degree are required." });
    }

    const entry = await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy: fieldOfStudy || null,
        location: location || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        current: Boolean(current),
        description: description || null,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}

async function updateEducation(req, res, next) {
  try {
    const id = Number(req.params.id);
    const {
      institution,
      degree,
      fieldOfStudy,
      location,
      startDate,
      endDate,
      current,
      description,
      order,
    } = req.body;

    const entry = await prisma.education.update({
      where: { id },
      data: {
        ...(institution !== undefined && { institution }),
        ...(degree !== undefined && { degree }),
        ...(fieldOfStudy !== undefined && {
          fieldOfStudy: fieldOfStudy || null,
        }),
        ...(location !== undefined && { location: location || null }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
        ...(current !== undefined && { current: Boolean(current) }),
        ...(description !== undefined && { description: description || null }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(entry);
  } catch (err) {
    next(err);
  }
}

async function deleteEducation(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.education.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
