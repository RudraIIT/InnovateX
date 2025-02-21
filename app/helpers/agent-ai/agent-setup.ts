import { CODE_GENERATION_PROMPT, parser } from "./prompt";

export const stepOptions = (prompt: string) => ({
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
        'Content-Type': 'application/json'
    },
    data: {
        instructions: `Generate clear implementation steps for: "${prompt}"`,
        llm_engine: "gpt4o"
    }
});

// Function to generate codeOptions request payload
export const codeOptions = (prompt: string, steps: string) => ({
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
        'Content-Type': 'application/json'
    },
    data: {
        instructions: parser(CODE_GENERATION_PROMPT(prompt, steps)),
        llm_engine: "gpt4o"
    }
});
