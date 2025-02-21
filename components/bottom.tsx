
import  Link  from 'next/link';
import React from 'react';
import { Facebook, Youtube, Twitter } from 'lucide-react';

interface BottomProps {}

const BottomProps: React.FC<BottomProps> = ({}) => {
    return(
        <div className="text-white flex flex-col min-h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center pt-20 pb-32 relative">
        <div className="absolute top-0 w-1/3 h-80  bg-gradient-to-r from-[#b446d3] to-[#1a83c9] rounded-b-full blur-2xl opacity-30"></div>
        <div data-rf="frame.layer" className="absolute flex flex-row aspect-[10/4] -left-1/2 -right-1/2 translate-x-1/2 w-screen bottom-[70%] bg-landing-950 rounded-[50%] border-b border-b-landing-50/30 bg-[#0D0D1A] border-slate-600"></div>

        <div className="relative z-10 mb-6 ">
          <div className="w-24 h-24 bg-[#1A1A2E] rounded-[2rem] flex items-center justify-center border-2 border-white border-opacity-20">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
              <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
              <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
              <div className="w-5 h-5 bg-transparent"></div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold relative z-10">
          The missing platform to build your AI apps
        </h1>

        <p className="mt-4 text-gray-400 relative z-10">
          Use it to build your own AI powered apps. No coding required.
        </p>

        <div className="mt-6 flex gap-4 relative z-10">
          <button className="px-5 py-2 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white">
            Get access
          </button>
          <button className="px-5 py-2 rounded-3xl bg-gray-700 hover:bg-gray-600 text-white">
            Book a demo
          </button>
        </div>
      </div>

      <footer className="mt-auto py-10 px-8 bg-[#0D0D1A] text-gray-400">
        <div className="flex flex-col md:flex-row justify-evenly items-center md:items-start mb-10">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-8 h-8  rounded-md flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-transparent"></div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="#" className="text-white hover:text-indigo-400">
              <Facebook/>
              </Link>
              <Link href="#" className="text-white hover:text-indigo-400"><Twitter/></Link>
              <Link href="#" className="text-white hover:text-indigo-400"><Youtube/></Link>
            </div>
          </div>

          <div className="mt-8 md:mt-0 text-center md:text-left">
            <h3 className="text-white font-semibold">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-indigo-400">Recipes</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Book a demo</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Pricing</Link></li>
            </ul>
          </div>

          <div className="mt-8 md:mt-0 text-center md:text-left">
            <h3 className="text-white font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-indigo-400">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
    )
}

export default BottomProps