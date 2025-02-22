import { NextRequest, NextResponse } from "next/server";
import { CODE_GENERATION_PROMPT, formatPrompt } from "@/helpers/prompt";
import axios from "axios";
import { parseResponse } from "@/helpers/parseResponse";
import path from "path";
import { readFileSync, rmSync } from "fs";

export async function GET(req: NextRequest) {
  try {
    const prompt = req.nextUrl.searchParams.get('prompt');
    if (!prompt) return NextResponse.error();
    const id = req.nextUrl.searchParams.get('steps');
    const basePath = process.env.NODE_ENV === 'development' ? process.cwd() : '/tmp';
    const filePath = path.join(basePath, `${id}.txt`);
    const steps = readFileSync(filePath, 'utf-8');
    if (!steps) return NextResponse.error();
    const title = steps.split('\n')[0].replace('Title: ', '');
    rmSync(filePath);
    const { data } = await axios.post("https://api-lr.agent.ai/v1/action/invoke_llm", {
      instructions: formatPrompt(CODE_GENERATION_PROMPT(prompt, steps)),
      llm_engine: "gpt4o"
    }, {
      headers: {
        Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const response = parseResponse(data.response);
    if (!response.title) response.title = title;
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
