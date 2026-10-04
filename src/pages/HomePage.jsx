import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
    </main>
  );
}

export default HomePage;
