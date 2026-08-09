require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Only these show as icon pills in the About section by default — the rest
// still appear in the full Skills grid. Toggle any skill's "Show in About"
// checkbox in the admin panel to change this later.
const ABOUT_HIGHLIGHTS = new Set([
  "React.js",
  "Next.js",
  "Node.js / Express.js",
  "MongoDB",
  "PostgreSQL",
  "JavaScript",
  "TypeScript",
  "Python",
  "Git / GitHub",
  "TensorFlow",
]);

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "you@example.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password";
  const adminName = process.env.ADMIN_NAME || "Shovit Regmi";

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
        tagline:
          "I turn ideas into modern digital experiences, combining clean code, thoughtful design, and full-stack development to solve real problems.",
        bio: "I\u2019m a full-stack developer and Computer Science student based in Kathmandu, Nepal \ud83c\uddf3\ud83c\uddf5, passionate about turning ideas into useful, real-world applications. I care about clean code, thoughtful interfaces, and building things that actually solve problems.\n\nI\u2019m naturally curious and always learning\u2014whether I\u2019m exploring a new technology, improving an existing project, or figuring out a better way to build something. For me, every project is an opportunity to learn, build, and grow.",
        major: "BSc. CSIT",
        location: "Kathmandu, Nepal",
        email: adminEmail,
        availability: true,
      },
    });
    console.log("Placeholder profile created.");
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    const skillRows = [
      // Frontend
      { name: "React.js", category: "Frontend", level: 90, order: 0 },
      { name: "Next.js", category: "Frontend", level: 85, order: 1 },
      { name: "HTML5", category: "Frontend", level: 95, order: 2 },
      { name: "CSS3", category: "Frontend", level: 90, order: 3 },
      { name: "Tailwind CSS", category: "Frontend", level: 80, order: 4 },
      // Backend
      {
        name: "Node.js / Express.js",
        category: "Backend",
        level: 90,
        order: 0,
      },
      { name: "NestJS", category: "Backend", level: 80, order: 1 },
      { name: "REST APIs", category: "Backend", level: 85, order: 2 },
      { name: "MongoDB", category: "Backend", level: 85, order: 3 },
      { name: "PostgreSQL", category: "Backend", level: 70, order: 4 },
      { name: "Mongoose", category: "Backend", level: 70, order: 5 },
      { name: "JWT Authentication", category: "Backend", level: 70, order: 6 },
      // Tools
      { name: "Git / GitHub", category: "Tools", level: 85, order: 0 },
      { name: "VS Code", category: "Tools", level: 90, order: 1 },
      { name: "Postman", category: "Tools", level: 75, order: 2 },
      { name: "MongoDB Atlas", category: "Tools", level: 80, order: 3 },
      { name: "Vercel", category: "Tools", level: 80, order: 4 },
      { name: "TensorFlow", category: "Tools", level: 55, order: 5 },
      { name: "OpenCV", category: "Tools", level: 55, order: 6 },
      // Languages
      { name: "JavaScript", category: "Languages", level: 85, order: 0 },
      { name: "TypeScript", category: "Languages", level: 75, order: 1 },
      { name: "Python", category: "Languages", level: 65, order: 2 },
      { name: "SQL", category: "Languages", level: 80, order: 3 },
      { name: "C", category: "Languages", level: 75, order: 4 },
      { name: "C++", category: "Languages", level: 75, order: 5 },
      { name: "Java", category: "Languages", level: 60, order: 6 },
    ].map((s) => ({ ...s, showInAbout: ABOUT_HIGHLIGHTS.has(s.name) }));

    await prisma.skill.createMany({ data: skillRows });
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
