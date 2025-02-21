import React from 'react';
import HeroVideoDialog from './ui/hero-video-dialog';
import { CodeBlockFun } from './code-block';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">

      <div className="relative mb-16">
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/h2qsN-BN6n0?si=u90h-NBzA5aJ8Zfi"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
      </div>

      <div>
        <div className="flex flex-col gap-4 p-9 hug items-center">
          <span className="font-medium text-[2.25rem] tracking-tight leading-none text-center text-neutral-50 max-w-[12ch] sm:max-w-[18ch] lg:max-w-[18ch] lg:text-[3.5rem]">
            Build{' '}
            <span className="leading-7 bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent">
              Stunning Websites{' '}
            </span>
            in Minutes!
          </span>
          <span className="text-lg lg:text-2xl text-center text-neutral-300 font-light leading-6 tracking-wide max-w-[30ch] sm:max-w-[45ch]">
            No Code. No Hassle. Just Innovation.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div data-rf="stack-x" className="flex flex-col md:flex-row grow gap-8 wrap md:flex-nowrap p-1 w-full">
            <div className="flex relative overflow-hidden [&>*:not(.data-rf-layer)]:z-10 flex-col rounded-3xl aspect-[2.5] sm:aspect-[1.8] flex-1 min-h-[200px] md:basis-1/3 md:max-h-[400px] bg-gradient-to-b from-indigo-400/40 hover:to-[#cc5bdd] p-px w-full">
            <div className="flex flex-col hug md:pt-5 md:pl-5 lg:pt-7 lg:px-7 md:gap-8 rounded-3xl">
                <div className="flex flex-col p-5 md:p-0 font-normal text-neutral-50 gap-2">
                <span className="text-lg tracking-tight">Build Websites Instantly</span>
                <span className="text-sm tracking-tight text-neutral-400">
                    Create stunning, high-performance websites with our no-code and low-code platform.
                </span>
                </div>
            </div>
            <div className="flex absolute data-rf-layer flex-row inset-[1px] bg-slate-950 rounded-3xl"></div>
            </div>

            <div className="flex relative overflow-hidden [&>*:not(.data-rf-layer)]:z-10 flex-col rounded-3xl aspect-[1.8] md:aspect-[2.5] flex-1 min-h-[200px] md:basis-1/3 md:max-h-[400px] bg-gradient-to-b from-indigo-400/40 hover:to-[#cc5bdd] p-px w-full">
            <div className="flex flex-col grow hug md:pt-5 md:pl-5 lg:pt-7 lg:px-7 md:gap-8 rounded-3xl">
                <div className="flex flex-col p-5 md:p-0 font-normal text-neutral-50 gap-2">
                <span className="text-lg tracking-tight">Fully Customizable</span>
                <span className="text-sm tracking-tight text-neutral-400">
                    Adjust every element with intuitive drag-and-drop tools or dive into custom coding.
                </span>
                </div>
            </div>
            <div className="flex absolute data-rf-layer flex-row inset-[1px] bg-slate-950 rounded-3xl"></div>
            </div>
        </div>

        <div className="flex relative overflow-hidden [&>*:not(.data-rf-layer)]:z-10 flex-col rounded-3xl aspect-[3.5] md:aspect-[2.5] flex-1 min-h-[200px] md:basis-2/3 md:max-h-[400px] bg-gradient-to-b md:bg-gradient-to-r from-indigo-400/40 to-indigo-400/10 md:to-indigo-400/0 hover:to-[#cc5bdd] p-px w-full">
            <div className="flex flex-col md:flex-row grow hug px-5 md:py-0 py-5 gap-5 md:gap-0 rounded-3xl">
            <div className="flex flex-col pb-0 md:p-0 font-normal text-neutral-50 gap-2 justify-center">
                <span className="text-lg tracking-tight">Deploy Instantly</span>
                <span className="text-sm tracking-tight text-neutral-400">
                Launch your website in seconds with our optimized, one-click deployment.
                </span>
            </div>
            </div>
            <div className="flex absolute data-rf-layer flex-row inset-[1px] bg-slate-950 rounded-3xl"></div>
        </div>
        </div>

        <div className='mx-auto w-full my-12'>
        <CodeBlockFun />
        </div>
      </div>
  );
};

export default About;