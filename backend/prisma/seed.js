require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
  const adminEmail = (process.env.ADMIN_EMAIL || "regmishovit12@gmail.com")
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
        title: "Full-Stack Web Developer",
        tagline:
          "Final-year BSc CSIT student building full-stack web applications, backend systems, and AI-powered tools — one commit at a time.",
        bio: "I'm a full-stack developer and final-year BSc CSIT student at Nagarjuna College of IT, based in Lalitpur, Nepal. I learn best by building and shipping real software — from REST APIs and role-based platforms to AI-powered apps with the Google Gemini API.\n\nI'm President of the Nagarjuna ICT Club and open to internships and entry-level full-stack roles in Nepal and remotely.",
        major: "BSc CSIT",
        institution: "Nagarjuna College of IT",
        educationStatus: "Final Year",
        currentFocus: "Full-Stack Development · Web Applications · Backend Systems",
        location: "Sanepa, Lalitpur, Nepal",
        email: adminEmail,
        phone: "+977 9866599038",
        githubUrl: "https://github.com/shovitregmi",
        linkedinUrl: "https://linkedin.com/in/shovitregmi",
        availability: true,
      },
    });
    console.log("Profile created.");
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    const skillRows = [
      { name: "React.js", category: "Frontend", level: 90, order: 0 },
      { name: "Next.js", category: "Frontend", level: 85, order: 1 },
      { name: "HTML5", category: "Frontend", level: 95, order: 2 },
      { name: "CSS3", category: "Frontend", level: 90, order: 3 },
      { name: "Tailwind CSS", category: "Frontend", level: 85, order: 4 },
      {
        name: "Node.js / Express.js",
        category: "Backend",
        level: 90,
        order: 0,
      },
      { name: "NestJS", category: "Backend", level: 75, order: 1 },
      { name: "REST APIs", category: "Backend", level: 85, order: 2 },
      { name: "MongoDB", category: "Backend", level: 85, order: 3 },
      { name: "PostgreSQL", category: "Backend", level: 80, order: 4 },
      { name: "JWT Authentication", category: "Backend", level: 80, order: 5 },
      { name: "Git / GitHub", category: "Tools", level: 85, order: 0 },
      { name: "VS Code", category: "Tools", level: 90, order: 1 },
      { name: "Postman", category: "Tools", level: 75, order: 2 },
      { name: "Vercel", category: "Tools", level: 80, order: 3 },
      { name: "Figma", category: "Tools", level: 70, order: 4 },
      { name: "TensorFlow", category: "Tools", level: 60, order: 5 },
      { name: "JavaScript", category: "Languages", level: 85, order: 0 },
      { name: "TypeScript", category: "Languages", level: 75, order: 1 },
      { name: "Python", category: "Languages", level: 70, order: 2 },
      { name: "SQL", category: "Languages", level: 80, order: 3 },
      { name: "C", category: "Languages", level: 75, order: 4 },
      { name: "C++", category: "Languages", level: 75, order: 5 },
      { name: "Java", category: "Languages", level: 60, order: 6 },
    ].map((s) => ({ ...s, showInAbout: ABOUT_HIGHLIGHTS.has(s.name) }));

    await prisma.skill.createMany({ data: skillRows });
    console.log("Skills created.");
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Co-Work",
          slug: "co-work",
          summary:
            "Role-based project management platform with task boards, notifications, and reporting.",
          description:
            "Working on a role-based platform (Admin, Project Manager, Member) with project/task management, notifications, and reporting, built by a 5-person team. Owned most of backend routes and business logic.",
          tags: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"],
          liveUrl: "https://co-work-management.vercel.app",
          repoUrl: "https://github.com/shovitregmi/project-management",
          featured: true,
          order: 0,
        },
        {
          title: "BachatPro",
          slug: "bachatpro",
          summary:
            "AI-powered expense tracker with Gemini features, budgets, and CSV reports.",
          description:
            "Built a full-stack expense tracker with authentication, per-category budgets, and six Gemini-powered AI features including natural-language expense entry and spending insights.",
          tags: ["MongoDB", "Express.js", "Next.js", "Node.js", "Google Gemini API"],
          repoUrl: "https://github.com/shovitregmi/ExpenseTracker",
          featured: true,
          order: 1,
        },
        {
          title: "Portfolio Website",
          slug: "portfolio-website",
          summary:
            "Full-stack portfolio with public site and password-protected admin CMS.",
          description:
            "Built a full-stack personal portfolio with PostgreSQL, Prisma, JWT-authenticated REST API, and admin dashboard for managing profile, skills, projects, and certificates.",
          tags: ["Next.js", "Express.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
          liveUrl: "https://shovitregmi.com.np",
          repoUrl: "https://github.com/shovitregmi/Portfolio-Website",
          featured: true,
          order: 2,
        },
        {
          title: "SignalSign",
          slug: "signalsign",
          summary:
            "Sign language detection app with real-time TFLite inference and user accounts.",
          description:
            "Extended an ML internship project into a full-stack application with real-time detection, JWT auth, and saved detection history.",
          tags: ["Python", "FastAPI", "TFLite", "React", "Express.js", "MongoDB"],
          repoUrl: "https://github.com/shovitregmi/SignalSign",
          featured: false,
          order: 3,
        },
      ],
    });
    console.log("Projects created.");
  }

  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          company: "CODEIT",
          position: "Full Stack Development Intern",
          location: "Dharan, Nepal (Remote)",
          startDate: new Date("2026-01-01"),
          current: true,
          description:
            "Collaborating with a cross-functional team to build Co-Work, a full-stack, role-based project management platform.\nContributing across the stack with a primary focus on backend architecture: REST API routes, JWT authentication, and role-based access control.\nWorking within a structured Git workflow with feature branches, pull requests, and code reviews.",
          technologies: ["Next.js", "Express.js", "MongoDB", "JWT"],
          order: 0,
        },
        {
          company: "Dasraa Tech",
          position: "Student Intern — AI/ML & Data Science",
          location: "Kathmandu, Nepal",
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-08-31"),
          current: false,
          description:
            "Completed 120 hours of intensive AI/ML & Data Science training using Python (Pandas, NumPy, Matplotlib).\nConducted a student performance analysis project applying data preprocessing and predictive modeling.\nBuilt the initial version of 'AI for Inclusiveness,' a sign language detection prototype using TensorFlow.",
          technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "TensorFlow"],
          order: 1,
        },
      ],
    });
    console.log("Experiences created.");
  }

  const educationCount = await prisma.education.count();
  if (educationCount === 0) {
    await prisma.education.createMany({
      data: [
        {
          institution: "Nagarjuna College of IT — Tribhuvan University",
          degree: "BSc Computer Science & Information Technology",
          fieldOfStudy: "CSIT",
          location: "Sankhamul, Lalitpur",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2027-06-01"),
          current: true,
          description:
            "Relevant Coursework: Web Development, Database Management, Data Structures, Software Engineering, C/C++/Java\nPresident — Nagarjuna ICT Club (30+ members)",
          order: 0,
        },
        {
          institution: "United College, Kumaripati",
          degree: "Plus 2 in Science",
          location: "Lalitpur",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2022-06-01"),
          current: false,
          description: "Science stream — National Examination Board",
          order: 1,
        },
      ],
    });
    console.log("Education created.");
  }

  const certificateCount = await prisma.certificate.count();
  if (certificateCount === 0) {
    await prisma.certificate.createMany({
      data: [
        {
          title: "MERN Stack Development",
          issuer: "CodeIT",
          issueDate: new Date("2026-06-01"),
          status: "completed",
          order: 0,
        },
        {
          title: "AI/ML & Data Science Bootcamp",
          issuer: "Darsaa Tech",
          issueDate: new Date("2024-08-01"),
          status: "completed",
          order: 1,
        },
        {
          title: "Professional UI/UX Design Training",
          issuer: "Broadway Infosys",
          issueDate: new Date("2024-08-01"),
          status: "completed",
          order: 2,
        },
        {
          title: "Front-End Development Course",
          issuer: "Sikaai-IT",
          issueDate: new Date("2023-09-01"),
          status: "completed",
          order: 3,
        },
        {
          title: "React Workshop",
          issuer: "Workshop",
          status: "participated",
          order: 4,
        },
        {
          title: "Basics of Python",
          issuer: "Nagarjuna ICT Club",
          status: "completed",
          order: 5,
        },
      ],
    });
    console.log("Certificates created.");
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
