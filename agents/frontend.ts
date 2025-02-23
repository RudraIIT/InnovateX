import { Response } from "./master";
import { codeChain } from "@/helpers/agents";

export const generateCode = async (response: Response, toastId: string | number, codeId: string, prompt: string) => {
  const steps = [
    "Generate a modern, responsive website with a dark and light futuristic theme.",
    "Create a stylish navbar with a glassmorphism effect and smooth scrolling.",
    "Generate a visually stunning hero section with a beautiful animated background and gradient text.",
    "Create a feature section with a grid layout and engaging icons.",
    "Design a testimonials section with user avatars and smooth fade-in animation.",
    "Generate a CTA section with a bold button and an engaging subtitle.",
    "Design a minimalistic footer with social media links and a contact form.",
    "Enhance the UI with Framer Motion animations for section transitions.",
    "Fix alignment issues and **ensure proper spacing using flexbox/grid**.",
    "Make sure all sections are **center-aligned** and **responsive** on all screen sizes.",
    "Ensure proper **vertical rhythm** and consistent **padding/margin** throughout the website.",
    "Adjust typography and element positioning for a **more balanced visual hierarchy**.",
    // "Fix the navbar alignment and make sure it **doesn’t shift on mobile screens**.",
    // "Generate a **modern color palette** based on **dark and light theme** and apply it consistently.",
    "Enhance **contrast between text and background** for better readability.",
    "Improve **hover effects and active states** with subtle color transitions.",
    "Make **buttons and links** more visually appealing with **gradients and shadows**.",
    "Ensure proper **light/dark mode compatibility** with smooth transitions.",
    "Add **colorful illustrations** and **icons** to enhance the overall design.",
    "Make sure all components made are used",
    "Make sure there no such class used which not defined by tailwindcss or in globals.css"
  ];
  response = await codeChain(response, steps, toastId, codeId, prompt) 
  return response;
}