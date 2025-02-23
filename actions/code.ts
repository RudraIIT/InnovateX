"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";


export const createCode = async (
  response: {
    title?: string;
    files: { name: string; path: string; content: string }[];
    response: string;
  } | null,
  prompt?: string,
) => {
  try {
    if (!response || typeof response !== 'object') {
      return { error: 'Response object is required', status: 400 };
    }

    if (!Array.isArray(response.files)) {
      return { error: 'Files array is required', status: 400 };
    }

    if (!prompt) {
      return { error: 'Prompt is required', status: 400 };
    }

    const session = await currentUser();
    if (!session) return { error: 'Unauthorized', status: 401 };
    const email = session.emailAddresses[0].emailAddress;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const code = await db.code.create({
      data: {
        title: response.title || 'Untitled',
        chat: {
          create: [
            {
              message: prompt,
              type: 'PROMPT'
            },
            {
              message: response.response,
              type: 'RESPONSE'
            }
          ]
        },
        files: {
          create: response.files.map(({ name, path, content }) => ({
            name,
            path,
            content,
          }))
        },
        user: {
          connect: {
            id: user.id,
          }
        }
      },
      select: {
        id: true,
      }
    });
    return { data: { id: code.id }, status: 201 };
  } catch (error) {
    // console.log("error in create code", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const getCode = async (id: string) => {
  try {
    const session = await currentUser();
    if (!session) return { error: 'Unauthorized', status: 401 };
    const email = session.emailAddresses[0].emailAddress;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const code = await db.code.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        chat: {
          select: {
            message: true,
            type: true,
          },
          orderBy: {
            createdAt: 'asc',
          }
        },
        files: {
          select: {
            name: true,
            path: true,
            content: true,
          }
        },
        userId: true,
      }
    });
    if (!code) return { error: 'Code not found', status: 404 };
    if (code.userId !== user.id) return { error: 'Unauthorized', status: 401 };
    code.files = code.files.map(({ name, path, content }: { name: string; path: string; content: string }) => ({
      name,
      path: path[path.length - 1] === '/' ? path.slice(0, -1) : path,
      content
    }));
    return { data: code, status: 200 };
  } catch (error) {
    // console.log("error in getting code", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const getCodesMeta = async () => {
  try {
    const session = await currentUser();
    if (!session) return { error: 'Unauthorized', status: 401 };
    const email = session.emailAddresses[0].emailAddress;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const codes = await db.code.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    return { codes, status: 200 };
  } catch (error) {
    // console.log("error in getting codes", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const deleteCode = async (codeId: string) => {
  try {
    const session = await currentUser();
    if (!session) return { error: 'Unauthorized', status: 401 };
    const email = session.emailAddresses[0].emailAddress;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const code = await db.code.findFirst({
      where: {
        id: codeId,
      },
      select: {
        userId: true,
      }
    });
    if (!code) return { error: 'Code not found', status: 404 };
    if (code.userId !== user.id) return { error: 'Unauthorized', status: 401 };
    await db.chat.deleteMany({
      where: {
        codeId: codeId,
      }
    });
    await db.file.deleteMany({
      where: {
        codeId: codeId,
      }
    });
    await db.code.delete({
      where: {
        id: codeId,
      }
    });
    return { status: 204 };
  } catch (error) {
    // console.log("error in deleting code", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}