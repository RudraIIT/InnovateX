import { Dispatch, SetStateAction } from "react";
import { Response } from "./master";
import { codeChain } from "@/helpers/agents";

export const generateCode = async (backend: Response, frontend: Response, codeId: string, prompt: string, setProgress: Dispatch<SetStateAction<number>>) => {
  let response = {
    title: "",
    files: [] as Array<{ name: string; path: string; content: string }>,
    response: ""
  }

  const allFiles = [...backend.files, ...frontend.files];
  const fileMap = new Map<string, { name: string; path: string; content: string }>();

  for (const file of allFiles) {
    if (fileMap.has(file.path)) {
      const existingFile = fileMap.get(file.path)!;
      if (file.content.length > existingFile.content.length) {
        fileMap.set(file.path, file);
      }
    } else {
      fileMap.set(file.path, file);
    }
  }

  response.files = Array.from(fileMap.values());
  
  const steps = [
    "**Integrate** the **backend APIs** with the **frontend** by consuming **available endpoints** via **axios**.",
    "Ensure proper **error handling** and **loading states** for **API calls**.",
    "**Map** the **backend response structure** to **frontend state management**.",
    "**Include demo data** when **no data is available** from the backend.",
  ];

  response = await codeChain(response, steps, codeId, prompt, setProgress)
  return response;
}