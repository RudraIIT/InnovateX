import About from "@/components/about";
import { Intro } from "@/components/intro";
import { Navbar } from "@/components/navbar";
import BottomProps from "../components/bottom";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()

  console.log('user', user)

  return (
    <div className="relative w-[90%]">
        <Navbar />
        <Intro />
        <About />
        <BottomProps />
    </div>
  );
}