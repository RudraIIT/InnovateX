"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const formatOutput = (name: string, path: string, content: string) => {
  name = name.split('/').pop() || name;
  if (path.split('/')[0] == 'pages') path = 'src/app' + path.split('pages')[1];
  if (path.split('/')[0] == 'app') path = 'src/' + path;
  if (content) {
    const match = content.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
    if (match) content = match[1];
  }
  return { name, path, content };
}

export const updateFiles = async (accessToken: string, codeId: string, files: { name: string; path: string; content?: string }[]) => {
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
    await db.$transaction(
      files.map(({ name, path, content }) => {
        ({ name, path, content } = formatOutput(name, path, content || ''));
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
            content: content || '',
            codeId,
          }
        })}
      )
    );
    return { status: 204 };
  } catch (error) {
    // console.log("error in update files", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}