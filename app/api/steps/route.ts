import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const session = await currentUser();
  if (!session) return NextResponse.error();
  try {
    const prompt = req.nextUrl.searchParams.get('prompt');
    if (!prompt) return NextResponse.error();
    const { data } = await axios.post("https://api-lr.agent.ai/v1/action/invoke_llm", {
      instructions: `Generate clear implementation steps for: "${prompt}"`,
      llm_engine: "gpt4o"
    }, {
      headers: {
        Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const steps = data.response;
    const basePath = process.env.NODE_ENV === 'development' ? process.cwd() : '/tmp';
    const id = uuidv4();
    const filePath = path.join(basePath, `${id}.txt`);
    writeFileSync(filePath, steps);
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}