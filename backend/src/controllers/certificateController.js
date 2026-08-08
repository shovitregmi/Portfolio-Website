const prisma = require("../config/db");

async function listCertificates(req, res, next) {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
    });
    res.json(certificates);
  } catch (err) {
    next(err);
  }
}

async function createCertificate(req, res, next) {
  try {
    const { title, issuer, issueDate, credentialUrl, imageUrl, order } = req.body;
    if (!title || !issuer) {
      return res.status(400).json({ error: "Title and issuer are required." });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        credentialUrl,
        imageUrl,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.status(201).json(certificate);
  } catch (err) {
    next(err);
  }
}

async function updateCertificate(req, res, next) {
  try {
    const { id } = req.params;
    const { title, issuer, issueDate, credentialUrl, imageUrl, order } = req.body;

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(issuer !== undefined && { issuer }),
        ...(issueDate !== undefined && { issueDate: issueDate ? new Date(issueDate) : null }),
        ...(credentialUrl !== undefined && { credentialUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(certificate);
  } catch (err) {
    next(err);
  }
}

async function deleteCertificate(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.certificate.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCertificates, createCertificate, updateCertificate, deleteCertificate };
