import { ChevronRight } from "lucide-react";

export const Intro = () => {
  return (
    <section className="flex flex-col text-center justify-center items-center gap-6 lg:gap-8 py-10 relative z-10">
      <p className="font-normal text-sm leading-7 text-neutral-200 lg:text-lg -mb-3">AI Website Builder</p>
      <h2 className="font-semibold text-[2.5rem] tracking-tight leading-none text-center text-neutral-50 max-w-[12ch] sm:max-w-[18ch] lg:max-w-[18ch] lg:text-[4rem]">
        Build
        <span className="leading-7 bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent">
          {' '} websites {' '}
        </span>
        with a simple
        <span className="leading-7 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {' '} prompt {' '}
        </span>
      </h2>
      <span className="text-lg lg:text-2xl text-center text-neutral-300 font-extralight leading-6 tracking-wide max-w-[30ch] sm:max-w-[45ch]">
        Describe your idea, and we’ll generate a website instantly—no coding needed.
      </span>
      <button className="inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-primary-50 bg-[#635dff] hover:bg-opacity-90 py-2 px-4 rounded-full h-10 lg:h-14 font-normal text-sm lg:text-lg leading-5 gap-1 mt-4">
        Generate Now
        <ChevronRight size={24} />
      </button>
    </section>
  )
}