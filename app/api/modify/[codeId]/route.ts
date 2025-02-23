import { parseResponse } from "@/helpers/parseResponse";
import { CODE_MODIFICATION_PROMPT, formatPrompt } from "@/helpers/prompt";
import { db } from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface ModifyRouteParams {
  params: Promise<{
    codeId: string;
  }>;
}

const stringifyCodeFiles = (codeFiles: { name: string, path: string, content: string }[]) => {
  return codeFiles.map(({ name, path, content }) => {
    return (
      `<file>
        <name>${name}</name>
        <path>${path}</path>
        <content>
          ${content}
        </content>
      </file>`
    );
  }).join('\n\n');
};

export async function POST(req: NextRequest, { params } : ModifyRouteParams) {
  const { codeId } = await params;
  const prompt = req.nextUrl.searchParams.get('prompt');
  const system = req.nextUrl.searchParams.get('system');
  try {
    let body;
    if (system) body = await req.json();                                                                                    
    if (!prompt || !codeId) return NextResponse.error();
    let codeFiles = body?.files || [];
    if (!system) {
      const code = await db.code.findFirst({
        where: {
          id: codeId,
        },
        select: {
          id: true,
          title: true,
          files: {
            select: {
              name: true,
              path: true,
              content: true,
            },
          },
        },
      });
      if (!code) return NextResponse.error();
      codeFiles = code.files
    }
    const codeFilesString = stringifyCodeFiles(codeFiles);
    const codeModificationPrompt = CODE_MODIFICATION_PROMPT(prompt, codeFilesString);
    const { data } = await axios.post("https://api-lr.agent.ai/v1/action/invoke_llm", {
      instructions: formatPrompt(codeModificationPrompt),
      llm_engine: "gpt4o"
    }, {
      headers: {
        Authorization: `Bearer ${process.env.AGENT_AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const response = parseResponse(data.response);
    response.files = response.files.map(({ name, path, content }) => {
      if (path[0] == '/') path = path.slice(1);
      return { name, path, content };
    })
    if (!system) {
      await db.$transaction(
        response.files.map(({ name, path, content }) => {
          return db.file.upsert({
            where: {
              path_codeId: {
                path,
                codeId,
              }
            },
            update: { content },
            create: {
              name,
              path,
              content,
              codeId,
            }
          })}
        )
      );
      await db.code.update({
        where: {
          id: codeId,
        },
        data: {
          chat: {
            create: [
              {
                message: prompt,
                type: 'PROMPT',
              },
              {
                message: response.response,
                type: 'RESPONSE',
              },
            ]
          }
        }
      })
    }
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}