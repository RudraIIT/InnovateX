import { updateFiles } from "@/actions/file";
import { codeChain } from "@/helpers/agents";
import axios from "axios";
import { toast } from "sonner";
import { generateCode as databaseAgent } from "./database";
import { generateCode as backendAgent } from "./backend";
import { generateCode as frontendAgent } from "./frontend";
import { generateCode as managerAgent } from "./manager";
import { Dispatch, SetStateAction } from "react";

export type Response = {
  title: string;
  files: Array<{ name: string; path: string; content: string }>;
  response: string;
}

export const generateCode = async (
  prompt: string,
  toastId: string | number,
  setProgressMaster: Dispatch<SetStateAction<number>>,
  setProgressBackend: Dispatch<SetStateAction<number>>,
  setProgressFrontend: Dispatch<SetStateAction<number>>,
  setProgressDatabase: Dispatch<SetStateAction<number>>,
  setProgressManager: Dispatch<SetStateAction<number>>
) => {
  let response = {
    title: "",
    files: [] as Array<{ name: string; path: string; content: string }>,
    response: ""
  }
  const steps = [
    "Make **neccessary routes** required for the project"
  ];
  const progressPerStep = 100 / (steps.length + 2);
  const progressPerSec = progressPerStep / 31;
  let intervals = 0;
  let intervalId = setInterval(() => {
    setProgressMaster(prev => Math.min(prev + progressPerSec, 100));
    intervals++;
    if (intervals >= 30) {
      clearInterval(intervalId);
    }
  }, 1000);
  const { data : { id } } = await axios.get(`/api/steps?prompt=${prompt}`);
  clearInterval(intervalId);
  let currentProgress = ((0 + 1) * 100) / (steps.length + 2);
  setProgressMaster(() => Math.min(currentProgress, 100));
  toast.loading("Generating code...", { id: toastId });
  intervalId = setInterval(() => {
    setProgressMaster(prev => Math.min(prev + progressPerSec, 100));
    intervals++;
    if (intervals >= 30) {
      clearInterval(intervalId);
    }
  }, 1000);
  const { data: { response : { title, files, response : llm_response }, id : codeId} } = await axios.get(`/api/generate?prompt=${prompt}&steps=${id}`);
  clearInterval(intervalId);
  currentProgress = ((1 + 1) * 100) / (steps.length + 2);
  setProgressMaster(() => Math.min(currentProgress, 100));
  response.title = title;
  response.files.push(...files);
  response.response = llm_response;
  response = await codeChain(response, steps, codeId, prompt, setProgressMaster, 2);
  let backendResponse : Response = response;
  let frontendResponse : Response = response;
  const callDatabasenBackendAgent = async () => {
    backendResponse = await databaseAgent(backendResponse, codeId, prompt, setProgressDatabase);
    backendResponse = await backendAgent(backendResponse, codeId, prompt, setProgressBackend);
  }
  const callFrontendAgent = async () => {
    frontendResponse = await frontendAgent(frontendResponse, codeId, prompt, setProgressFrontend);
  }
  await Promise.all([
    callDatabasenBackendAgent(),
    callFrontendAgent()
  ]);
  response = await managerAgent(backendResponse, frontendResponse, codeId, prompt, setProgressManager);
  await updateFiles('', codeId, response.files);
  toast.success("Code generation complete!", { id: toastId });
  return {response, id: codeId};
}