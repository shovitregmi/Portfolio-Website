require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "you@example.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password";
  const adminName = process.env.ADMIN_NAME || "Your Name";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: adminName, email: adminEmail, passwordHash },
  });
  console.log(`Admin account ready: ${adminEmail}`);

  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: adminName,
        title: "Full-Stack Developer",
        tagline: "I build fast, reliable web apps from front to back.",
        bio: "Write a short bio about yourself here. Talk about what you build, what you're learning, and what you're looking for. Swap this out from the admin dashboard any time.",
        location: "Kathmandu, Nepal",
        email: adminEmail,
        availability: true,
      },
    });
    console.log("Placeholder profile created.");
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "JavaScript", category: "Languages", level: 80, order: 0 },
        { name: "React / Next.js", category: "Frontend", level: 75, order: 1 },
        { name: "Node.js / Express", category: "Backend", level: 75, order: 2 },
        { name: "PostgreSQL", category: "Backend", level: 65, order: 3 },
        { name: "Git & GitHub", category: "Tools", level: 80, order: 4 },
      ],
    });
    console.log("Placeholder skills created.");
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: "Sample Project",
        slug: "sample-project",
        summary: "A short one-line summary of a project you've built.",
        description:
          "Replace this with a longer description: the problem it solved, your role, the stack you used, and what you're proud of.",
        tags: ["Next.js", "Node.js", "PostgreSQL"],
        featured: true,
        order: 0,
      },
    });
    console.log("Placeholder project created.");
  }

  const certCount = await prisma.certificate.count();
  if (certCount === 0) {
    await prisma.certificate.create({
      data: {
        title: "Sample Certificate",
        issuer: "Course Provider",
        order: 0,
      },
    });
    console.log("Placeholder certificate created.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
