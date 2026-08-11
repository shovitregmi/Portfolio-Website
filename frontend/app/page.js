import { API_URL } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ExperienceEducation from "@/components/ExperienceEducation";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const revalidate = 60;

async function safeFetch(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [profile, skills, projects, experiences, education, certificates] =
    await Promise.all([
      safeFetch("/profile", null),
      safeFetch("/skills", []),
      safeFetch("/projects", []),
      safeFetch("/experiences", []),
      safeFetch("/education", []),
      safeFetch("/certificates", []),
    ]);

  const fallbackProfile = {
    name: "Shovit Regmi",
    title: "Full-Stack Web Developer",
    tagline: "Building modern web applications and backend systems.",
    bio: "Connect the backend to load profile content from the database.",
    major: "BSc CSIT",
    institution: "Nagarjuna College of IT",
    educationStatus: "Final Year",
    currentFocus: "Full-Stack Development",
    location: "Lalitpur, Nepal",
    email: "you@example.com",
    availability: true,
  };

  const p = profile || fallbackProfile;

  return (
    <>
      <Nav profile={p} />
      <main>
        <Hero profile={p} />
        <About profile={p} skills={skills} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <ExperienceEducation
          experiences={experiences}
          education={education}
        />
        <Certificates certificates={certificates} />
        <Contact profile={p} />
      </main>
      <Footer profile={p} />
    </>
  );
}
