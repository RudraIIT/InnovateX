import { updateFiles } from "@/actions/file";
import { codeChain } from "@/helpers/agents";
import axios from "axios";
import { toast } from "sonner";
import { generateCode as databaseAgent } from "./database";
import { generateCode as backendAgent } from "./backend";
import { generateCode as frontendAgent } from "./frontend";
import { generateCode as managerAgent } from "./manager";

export type Response = {
  title: string;
  files: Array<{ name: string; path: string; content: string }>;
  response: string;
}

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
    "Make **neccessary routes** required for the project"
  ];
  response = await codeChain(response, steps, toastId, codeId, prompt);
  let backendResponse : Response = response;
  let frontendResponse : Response = response;
  const callDatabasenBackendAgent = async () => {
    backendResponse = await databaseAgent(backendResponse, toastId, codeId, prompt);
    backendResponse = await backendAgent(backendResponse, toastId, codeId, prompt);
  }
  const callFrontendAgent = async () => {
    frontendResponse = await frontendAgent(frontendResponse, toastId, codeId, prompt);
  }
  await Promise.all([
    callDatabasenBackendAgent(),
    callFrontendAgent()
  ]);
  response = await managerAgent(backendResponse, frontendResponse, toastId, codeId, prompt);
  await updateFiles('', codeId, response.files);
  toast.success("Code generation complete!", { id: toastId });
  return {response, id: codeId};
}