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
};

export function getIcon(name) {
  return ICON_MAP[normalize(name)] || FiCode;
}
