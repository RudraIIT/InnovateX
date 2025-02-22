import Image from 'next/image';
import { IconBrandFacebook, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import {Zap, Briefcase, Book, Mail, File} from 'lucide-react';
import Link from 'next/link';
const Portfolio: React.FC = () => {
    return (
        <div className="flex antialiased h-screen overfow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64  shadow-md p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-4">
            {/* <Image src="/profile.jpg" alt="John Doe" width={50} height={50} className="rounded-full" /> */}
            <div>
              <h2 className="text-lg font-bold text-black">John Doe</h2>
              <p className="text-sm text-gray-500">Developer</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <a href="#" className="flex items-center space-x-2 text-blue-600 font-semibold">
              <Zap size={20} />
              <p className='px-2'>Home</p>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <File size={20} />
              <p className='px-2'>About</p>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Briefcase size={20} />
              <p className='px-2'>Projects</p>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Book size={20}/> 
             <p className='px-2'> Articles</p>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
                <Mail size={20}/>
                <p className='px-2'> Contact </p>
            </a>

            <h3 className="text-sm font-bold text-gray-500 pt-10">Socials</h3>
            <a href="#" className='flex items-center space-x-2 px-2 rounded-md text-sm group'>
            <IconBrandTwitter size={20} className='text-gray-500 group-hover:text-gray-800 transition duration-200' />
            <span className='text-gray-500 group-hover:text-gray-800 transition duration-200'>Twitter</span>
            </a>

            <a href="#" className='flex items-center space-x-2 px-2 rounded-md text-sm group'>
            <IconBrandFacebook size={18} className='text-gray-500 group-hover:text-gray-800 transition duration-200' />
            <span className='text-gray-500 group-hover:text-gray-800 transition duration-200'>Facebook</span>
            </a>

            <a href="#" className='flex items-center space-x-2 px-2 rounded-md text-sm group'>
            <IconBrandYoutube size={20} className='text-gray-500 group-hover:text-gray-800 transition duration-200' />
            <span className='text-gray-500 group-hover:text-gray-800 transition duration-200'>YouTube</span>
            </a>

            
            </div>
          </div>

        {/* Resume Button */}
        <a href="#" className="mt-10 bg-gray-900 text-white py-2 px-4 rounded-lg text-center shadow-lg hover:bg-gray-700">
          Read Resume
        </a>
      </aside>

      {/* Main Content */}
      <main className="flex justify-center p-10 bg-white overflow-auto">
        <div className=''>
        <h1 className="text-4xl font-bold mb-4 text-black">👋 Hello there! I'm John</h1>
        <p className="text-lg text-gray-600">I'm a full-stack developer that loves <span className="bg-gray-200 px-1 rounded">building products</span> and web apps that can impact millions of lives.</p>
        <p className="text-lg text-gray-600 mt-2">I'm a senior software engineer with <span className="bg-gray-200 px-1 rounded">7 years of experience</span> building scalable web apps that are performance optimized and good looking.</p>

        {/* Projects Section */}
        <h2 className="text-2xl font-bold mt-10 text-black">What I've been working on</h2>
        <div className="mt-5 space-y-6">
          {/* Project 1 */}
          <div className="flex items-start space-x-4">
            <Image src="/project2.png" alt="Algochurn" width={100} height={60} className="rounded-md" />
            <div>
              <h3 className="font-bold text-lg text-black">Project 1</h3>
              <p className="text-gray-600">Practice for technical interviews with hands-on coding challenges.</p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">Next.js</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">TailwindCSS</span>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="flex items-start space-x-4">
            <Image src="/project2.png" alt="Algochurn" width={100} height={60} className="rounded-md" />
            <div>
              <h3 className="font-bold text-lg text-black">Project 2</h3>
              <p className="text-gray-600">Practice for technical interviews with hands-on coding challenges.</p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">Next.js</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">TailwindCSS</span>
              </div>
            </div>
          </div>
          {/* Project 3 */}
          <div className="flex items-start space-x-4">
            <Image src="/project2.png" alt="Algochurn" width={100} height={60} className="rounded-md" />
            <div>
              <h3 className="font-bold text-lg text-black">Project 3</h3>
              <p className="text-gray-600">Practice for technical interviews with hands-on coding challenges.</p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">Next.js</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">TailwindCSS</span>
              </div>
            </div>
          </div>
          {/* Project 4 */}
          <div className="flex items-start space-x-4">
            <Image src="/project2.png" alt="Algochurn" width={100} height={60} className="rounded-md" />
            <div>
              <h3 className="font-bold text-lg text-black">Project 4</h3>
              <p className="text-gray-600">Practice for technical interviews with hands-on coding challenges.</p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">Next.js</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">TailwindCSS</span>
              </div>
            </div>
          </div>
          {/* Project 5 */}
          <div className="flex items-start space-x-4">
            <Image src="/project2.png" alt="Algochurn" width={100} height={60} className="rounded-md" />
            <div>
              <h3 className="font-bold text-lg text-black">Project 5</h3>
              <p className="text-gray-600">Practice for technical interviews with hands-on coding challenges.</p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">Next.js</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm text-black">TailwindCSS</span>
              </div>
            </div>
          </div>

          <div className='-mt-15'>
            <h2 className=' bg-clip-text text-gray-600 font-black text-lg md:text-lg lg:text-lg mt-20 mb-4'> Tech Stack
            </h2>
            <div className='flex flex-wrap'>
                {/* Tech Stacks, write your tech stacks here */}

            </div>
          </div>
        </div>
        </div>
      </main>
    </div>

    )
}

export default Portfolio;