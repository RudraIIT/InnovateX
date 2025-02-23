import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createHash } from "crypto";
import path from "path";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.VERCEL_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Vercel API Key is missing" }, { status: 500 });
        }

        const formData = await req.formData();
        const fileSystemBlob = formData.get("fileSystem") as File;
        const projectName = formData.get("projectName") as string;

        const fileSystemText = await fileSystemBlob.text();
        const fileSystem = JSON.parse(fileSystemText);


        const collectFiles = (items: any, basePath = ""): { file: string; data: Buffer | string; sha: string; size: number }[] => {
            let files: any[] = [];
        
            for (const item of items) {
                const fullPath = path.join(basePath, item.name).replace(/\\/g, "/");
        
                if (item.type === "folder") {
                    files.push({
                        file: fullPath + "/",
                        data: "",
                        sha: createHash("sha1").update("").digest("hex"),
                        size: 0,
                    });
        
                    if (item.children && Array.isArray(item.children)) {
                        files = files.concat(collectFiles(item.children, fullPath));
                    }
                } else if (item.type === "file") {
                    const fileContent = item.content ?? "";
                    const buffer = Buffer.from(fileContent, "utf-8");
                    const sha = createHash("sha1").update(buffer).digest("hex");
        
                    files.push({
                        file: fullPath,
                        data: buffer,
                        sha,
                        size: buffer.length,
                    });
                }
            }
        
            return files;
        };
        
        const vercelFiles = collectFiles(fileSystem);
        

        if (vercelFiles.length === 0) {
            return NextResponse.json({ error: "No valid files for deployment" }, { status: 400 });
        }

        console.log("Uploading files to Vercel...");
        await Promise.all(
            vercelFiles.map(async (file: { file: string; data: string | Buffer; sha: string; size: number; }) => {
                await axios.post(
                    "https://api.vercel.com/v2/files",
                     file.data,
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/octet-stream",
                            "x-vercel-digest": file.sha,
                            "x-vercel-file": file.file,
                        },
                    }
                );
            })
        );

        console.log("Creating Vercel deployment...");
        const response = await axios.post(
            "https://api.vercel.com/v13/deployments",
            {
                name: projectName,
                files: vercelFiles.map(({ file, sha, size }) => ({
                    file,
                    sha,
                    size,
                })),
                projectId: process.env.VERCEL_PROJECT_ID,
                target: "production",
                projectSettings: { framework: "nextjs" },
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Deployment Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || error.message },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};