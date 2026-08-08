import { API_URL } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";

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
  const [profile, skills, projects] = await Promise.all([
    safeFetch("/profile", null),
    safeFetch("/skills", []),
    safeFetch("/projects", []),
  ]);

  const fallbackProfile = {
    name: "Your Name",
    title: "Full-Stack Developer",
    tagline: "I build fast, reliable web apps from front to back.",
    bio: "Connect the backend and this bio will come from your database.",
    location: "Kathmandu, Nepal",
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
        <Contact profile={p} />
      </main>
      <Footer profile={p} />
      <StatusBar profile={p} />
    </>
  );
}