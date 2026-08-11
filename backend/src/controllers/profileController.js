const prisma = require("../config/db");

// The site has exactly one profile row. Create it on first read if missing.
async function getOrCreateProfile() {
  const existing = await prisma.profile.findFirst();
  if (existing) return existing;
  return prisma.profile.create({ data: {} });
}

async function getProfile(req, res, next) {
  try {
    const profile = await getOrCreateProfile();
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await getOrCreateProfile();
    const {
      name,
      title,
      tagline,
      bio,
      major,
      institution,
      educationStatus,
      currentFocus,
      location,
      email,
      phone,
      resumeUrl,
      avatarUrl,
      availability,
      githubUrl,
      linkedinUrl,
      instagramUrl,
      whatsappUrl,
    } = req.body;

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(tagline !== undefined && { tagline }),
        ...(bio !== undefined && { bio }),
        ...(major !== undefined && { major }),
        ...(institution !== undefined && { institution }),
        ...(educationStatus !== undefined && { educationStatus }),
        ...(currentFocus !== undefined && { currentFocus }),
        ...(location !== undefined && { location }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(availability !== undefined && { availability }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(instagramUrl !== undefined && { instagramUrl }),
        ...(whatsappUrl !== undefined && { whatsappUrl }),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };
