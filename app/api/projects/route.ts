/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import path from 'path';
import { type NextRequest } from 'next/server'

const templateDir = path.join(process.cwd(), 'public', 'templates');

interface FileObject {
  name: string;
  path: string;
  content?: string;
}

const processDirectory = async (dirPath: string): Promise<FileObject[]> => {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  const fileArray: FileObject[] = [];
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      const subDirFiles = await processDirectory(fullPath);
      fileArray.push(...subDirFiles);
    } else if (file.isSymbolicLink()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const symlinkTarget = await fs.readlink(fullPath);
      fileArray.push({
        name: file.name,
        path: fullPath.replace(templateDir, '').split('/').slice(2).join('/'),
      });
    } else {
      const content = await fs.readFile(fullPath, 'utf-8');
      fileArray.push({
        name: file.name,
        path: fullPath.replace(templateDir, '').split('/').slice(2).join('/'),
        content: content
      });
    }
  }
  
  return fileArray;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const template = searchParams.get('template');
    
    if (!template) {
      throw new Error('Template parameter is missing');
    }
    
    const templatePath = path.join(templateDir, template);
    const fileList = await processDirectory(templatePath);

    return Response.json(fileList);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate project file list' });
  }
}