import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiMongodb,
  SiPostgresql,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiFigma,
  SiGit,
  SiGithub,
  SiPython,
  SiTensorflow,
  SiOpencv,
  SiCplusplus,
  SiPostman,
  SiVercel,
  SiVisualstudiocode,
} from "react-icons/si";
import { FiCode } from "react-icons/fi";

function normalize(name = "") {
  return name.toLowerCase().replace(/[.\-_/\s]+/g, "");
}

const ICON_MAP = {
  javascript: SiJavascript,
  js: SiJavascript,
  typescript: SiTypescript,
  ts: SiTypescript,
  react: SiReact,
  reactjs: SiReact,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  express: SiExpress,
  expressjs: SiExpress,
  nest: SiNestjs,
  nestjs: SiNestjs,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  mongodbatlas: SiMongodb,
  mern: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  figma: SiFigma,
  git: SiGit,
  github: SiGithub,
  python: SiPython,
  tensorflow: SiTensorflow,
  opencv: SiOpencv,
  "c++": SiCplusplus,
  cpp: SiCplusplus,
  cc: SiCplusplus,
  postman: SiPostman,
  vercel: SiVercel,
  vscode: SiVisualstudiocode,
  visualstudiocode: SiVisualstudiocode,
};

// Auto-detect an icon from a free-text name (used when no manual override
// is set). Falls back to a generic code icon if nothing matches.
export function getIcon(name) {
  return ICON_MAP[normalize(name)] || FiCode;
}

// The curated list shown in admin icon-picker dropdowns. `key` is what
// gets stored in the database (Skill.icon / Project.tagIcons); `label` is
// what the admin sees.
export const ICON_OPTIONS = [
  { key: "javascript", label: "JavaScript" },
  { key: "typescript", label: "TypeScript" },
  { key: "react", label: "React" },
  { key: "nextjs", label: "Next.js" },
  { key: "nodejs", label: "Node.js" },
  { key: "express", label: "Express" },
  { key: "nestjs", label: "NestJS" },
  { key: "mongodb", label: "MongoDB" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "html5", label: "HTML5" },
  { key: "css3", label: "CSS3" },
  { key: "tailwindcss", label: "Tailwind CSS" },
  { key: "figma", label: "Figma" },
  { key: "git", label: "Git" },
  { key: "github", label: "GitHub" },
  { key: "python", label: "Python" },
  { key: "tensorflow", label: "TensorFlow" },
  { key: "opencv", label: "OpenCV" },
  { key: "cpp", label: "C / C++" },
  { key: "postman", label: "Postman" },
  { key: "vercel", label: "Vercel" },
  { key: "vscode", label: "VS Code" },
];

// Resolves a stored icon key (from the picker) to its component.
// Used when a Skill/Project has a manual override saved.
export function getIconByKey(key) {
  return ICON_MAP[key] || FiCode;
}
