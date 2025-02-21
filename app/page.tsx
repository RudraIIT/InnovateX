import About from "@/components/about";
import { Intro } from "@/components/intro";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative w-[90%]">
        <About />
        <Navbar />
        <Intro />
    </div>
  );
}