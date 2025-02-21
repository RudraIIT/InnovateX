import About from "@/components/about";
import { Intro } from "@/components/intro";
import { Navbar } from "@/components/navbar";
import BottomProps from "../components/bottom";

export default function Home() {
  return (
    <div className="relative w-[90%]">
        <Navbar />
        <Intro />
        <About />
        <BottomProps />
    </div>
  );
}