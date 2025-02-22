import axios from "axios";
import { toast } from "sonner";

export const generateCode = async (prompt: string, toastId: string | number) => {
  let response = {
    title: "",
    files: [] as Array<{ name: string; path: string; content: string }>,
    response: ""
  }
  
  const { data : { id } } = await axios.get(`/api/steps?prompt=${prompt}`);
  toast.loading("Generating code...", { id: toastId });
  const { data: { response : { title, files, response : llm_response }, id : codeId} } = await axios.get(`/api/generate?prompt=${prompt}&steps=${id}`);
  response.title = title;
  response.files.push(...files);
  response.response = llm_response;
  
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
    "Fix the navbar alignment and make sure it **doesn’t shift on mobile screens**.",
    "Generate a **modern color palette** based on **dark and light theme** and apply it consistently.",
    "Enhance **contrast between text and background** for better readability.",
    "Improve **hover effects and active states** with subtle color transitions.",
    "Make **buttons and links** more visually appealing with **gradients and shadows**.",
    "Ensure proper **light/dark mode compatibility** with smooth transitions.",
    "Add **colorful illustrations** and **icons** to enhance the overall design."
  ];

  for (const step of steps) {
    toast.loading(`prompt: ${step}`, { id: toastId });
    const { data: { response: { title: stepTitle, files: stepFiles, response: stepResponse } } } = await axios.get(`/api/modify/${codeId}?prompt=${step} user demand is ${prompt}&system=true`);
    response.title = stepTitle;
    for (const file of stepFiles) {
      const existingFile = response.files.find(f => f.path === file.path);
      if (existingFile) {
        existingFile.content = file.content;
      } else {
        response.files.push(file);
      }
    }
    response.response = stepResponse;
  }

  toast.success("Code generation complete!", { id: toastId });
  return {response, id: codeId};
}