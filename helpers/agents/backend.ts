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
    "Generate a modern, scalable Next.js backend with API routes and middleware.",
    "Create a secure authentication system using NextAuth.js with JWT and OAuth support.",
    "Generate API routes with proper error handling and validation using Zod.",
    "Implement a robust role-based access control (RBAC) system for user authorization.",
    "Create a database schema using Prisma ORM and connect it to a PostgreSQL database.",
    "Generate a RESTful API structure with proper method handling (GET, POST, PUT, DELETE).",
    "Ensure all API responses follow a consistent structure with status codes and messages.",
    "Add middleware for logging API requests and responses for better debugging.",
    "Secure API routes with authentication middleware to prevent unauthorized access.",
    "Ensure API routes are optimized for serverless deployment on Vercel.",
    "Generate a centralized error-handling middleware for better debugging.",
    "Implement environment variable management using dotenv and Next.js runtime config.",
    "Ensure API endpoints are structured in a modular and maintainable way.",
    "Generate a backend health check API route to monitor server status.",
    "Set up multi-tenancy in the Next.js backend using middleware and database isolation.",
    "Improve backend security by sanitizing user input and preventing SQL injection.",
    "Optimize the backend for scalability by leveraging Edge Functions where applicable.",
    "Ensure all backend responses are JSON-structured and follow best practices."
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