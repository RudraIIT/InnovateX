import { Response } from "./master";
import { codeChain } from "@/helpers/agents";

export const generateCode = async (response: Response, toastId: string | number, codeId: string, prompt: string) => {
  const steps = [
    "Generate a **modern** Next.js backend with **API routes** .",
    "Create a **secure authentication** system using **NextAuth.js** with **JWT** or **OAuth support**.",
    "Generate **API routes** with **proper error handling** and **validation using Zod**.",
    "Implement a robust **role-based access control (RBAC)** system for **user authorization**.",
    "Create a **database schema** using **Prisma ORM** and **connect** it to a **PostgreSQL database**.",
    "Generate a **RESTful API** structure with **proper method handling (GET, POST, PUT, DELETE)**.",
    "Ensure all API responses follow a **consistent structure** with **status codes** and **messages**.",
    "Ensure **API routes are optimized** for **serverless deployment** on Vercel.",
    "Implement **environment variable management** using **dotenv** and **Next.js runtime config**.",
    "Improve **backend security** by **sanitizing user input** and **preventing SQL injection**.",
    "Optimize the **backend for scalability** by **leveraging Edge Functions** where applicable.",
    "Ensure all **backend responses** are **JSON-structured** and **follow best practices**."
  ];
  response = await codeChain(response, steps, toastId, codeId, prompt)
  return response;
}