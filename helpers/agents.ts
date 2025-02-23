import { Response } from "@/agents/master";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const codeChain = async (response: Response, steps: string[], codeId: string, prompt: string, setProgress: Dispatch<SetStateAction<number>>, shift = 0) => {
  const progressPerStep = 100 / (steps.length + shift);
  for (const step of steps) {
    const progressPerSec = progressPerStep / 31;
    let intervals = 0;
    const intervalId = setInterval(() => {
      setProgress(prev => Math.min(prev + progressPerSec, 100));
      intervals++;
      if (intervals >= 30) {
        clearInterval(intervalId);
      }
    }, 1000);
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
    clearInterval(intervalId);
    const index = steps.indexOf(step) + shift;
    const currentProgress = ((index+1) * 100) / (steps.length + shift);
    setProgress(() => Math.min(currentProgress, 100));
  }
  setProgress(100);
  return response;
}