import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Statistics from "./components/Statistics";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Statistics/>
      <Footer />
    </main>
  );
}