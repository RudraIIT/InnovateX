import { Response } from "@/agents/master";
import axios from "axios";
import { toast } from "sonner";

export const codeChain = async (response: Response, steps: string[], toastId: string | number, codeId: string, prompt: string) => {
  for (const step of steps) {
    toast.loading(`prompt: ${step}`, { id: toastId });
    const { data: { response: { title: stepTitle, files: stepFiles, response: stepResponse } } } = await axios.post(`/api/modify/${codeId}?prompt=${step} user demand is ${prompt}&system=true`, {
      files: response.files
    });
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
  return response;
}