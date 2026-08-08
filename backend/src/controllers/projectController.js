const prisma = require("../config/db");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base, ignoreId) {
  let slug = slugify(base) || "project";
  let n = 1;
  // Loop until we find a slug that isn't taken by another project
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

async function listProjects(req, res, next) {
  try {
    const { featured } = req.query;
    const where = featured === "true" ? { featured: true } : {};
    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const { title, summary, description, imageUrl, tags, liveUrl, repoUrl, featured, order } = req.body;
    if (!title || !summary || !description) {
      return res.status(400).json({ error: "Title, summary, and description are required." });
    }

    const slug = await uniqueSlug(title);
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        summary,
        description,
        imageUrl,
        tags: Array.isArray(tags) ? tags : [],
        liveUrl,
        repoUrl,
        featured: Boolean(featured),
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { title, summary, description, imageUrl, tags, liveUrl, repoUrl, featured, order } = req.body;

    const data = {
      ...(summary !== undefined && { summary }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
      ...(liveUrl !== undefined && { liveUrl }),
      ...(repoUrl !== undefined && { repoUrl }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(order !== undefined && { order: Number(order) }),
    };

    if (title !== undefined) {
      data.title = title;
      data.slug = await uniqueSlug(title, id);
    }

    const project = await prisma.project.update({ where: { id }, data });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject };
