import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import Team from "@/components/sections/Team";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Divisions />
      <Team />
      <Projects />
      <Footer />
    </main>
  );
}

