import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import GitHubStrip from "@/components/GitHubStrip";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import ScrollReveal from "@/components/ScrollReveal";
import Terminal from "@/components/Terminal";
import { fetchProjects, fetchSkills } from "@/lib/api";
import { Project, Skill } from "@/types";

export default async function Home() {
  let projects: Project[] = [];
  let skills: Skill[] = [];

  try {
    const [pData, sData] = await Promise.all([fetchProjects(), fetchSkills()]);
    projects = pData.projects;
    skills = sData.skills;
  } catch (err) {
    console.error("Error loading terminal dependencies on homepage:", err);
  }

  return (
    <main className="min-h-screen bg-ink">
      <CursorGlow />
      <ScrollReveal />
      <Navbar />

      {/* Hero has its own stagger animations */}
      <Hero />
      <Ticker />

      <div className="reveal">
        <Terminal projects={projects} skills={skills} />
      </div>

      <div className="reveal">
        <About />
      </div>
      <div className="reveal" style={{ transitionDelay: "0.05s" }}>
        <Experience />
      </div>
      <div className="reveal" style={{ transitionDelay: "0.1s" }}>
        <Skills />
      </div>
      <div className="reveal" style={{ transitionDelay: "0.05s" }}>
        <GitHubStrip />
      </div>
      <div className="reveal" style={{ transitionDelay: "0.1s" }}>
        <Projects />
      </div>
      <div className="reveal" style={{ transitionDelay: "0.05s" }}>
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
