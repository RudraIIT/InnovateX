import { NextRequest, NextResponse } from "next/server";
import { parser, CODE_GENERATION_PROMPT } from "@/app/helpers/prompt";
import axios from "axios";


async function getSteps(prompt: string): Promise<string | undefined> {
    try {
        const { data } = await axios.post("https://api-lr.agent.ai/v1/action/invoke_llm", {
            instructions: `Generate clear implementation steps for: "${prompt}"`,
            llm_engine: "gpt4o"
        }, {
            headers: {
                Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("step response", data);
        return data.resposne;
    } catch (error) {
        console.log(error);
    }
}

export async function GET(req: NextRequest) {
    try {
        const prompt = req.nextUrl.searchParams.get('prompt');
        if (!prompt) return NextResponse.error();
        const steps = await getSteps(prompt);
        if (!steps) {
            return NextResponse.error();
        }
        const response = await axios.post("https://api-lr.agent.ai/v1/action/invoke_llm", {

            instructions: parser(CODE_GENERATION_PROMPT(prompt, steps)),
            llm_engine: "gpt4o"

        }, {
            headers: {
                Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
    }
}
