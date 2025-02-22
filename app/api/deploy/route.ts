import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import unzipper from "unzipper";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.VERCEL_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Vercel API Key is missing" }, { status: 500 });
        }

        const { projectName } = await req.json();
        if (!projectName) {
            return NextResponse.json({ error: "Missing projectName" }, { status: 400 });
        }

        const zipPath = path.join("public/tmp", `${projectName}.zip`);
        console.log("ZIP Path:", zipPath);

        try {
            await fs.access(zipPath);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return NextResponse.json({ error: `ZIP file not found: ${zipPath}` }, { status: 404 });
        }

        console.log("Extracting ZIP file...");
        const extractPath = path.join("/tmp", projectName);
        await fs.mkdir(extractPath, { recursive: true });

        const directory = await unzipper.Open.file(zipPath);
        await directory.extract({ path: extractPath });

        let rootPath = path.join(extractPath, projectName);
        const extractedItems = await fs.readdir(extractPath, { withFileTypes: true });
        if (extractedItems.length === 1 && extractedItems[0].isDirectory()) {
            rootPath = path.join(extractPath, extractedItems[0].name);
        }
        console.log("Using extracted path:", rootPath);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collectFiles = async (dir: string, baseDir: string = ""): Promise<any[]> => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            const files = await Promise.all(
                entries.map(async (entry) => {
                    const fullPath = path.join(dir, entry.name);
                    const relativePath = path.join(baseDir, entry.name);

                    // Skip .git and other unwanted directories/files
                    if (entry.name === ".git" || entry.name.startsWith(".")) {
                        return null;
                    }

                    if (entry.isDirectory()) {
                        return collectFiles(fullPath, relativePath);
                    } else {
                        const content = await fs.readFile(fullPath);
                        const sha = createHash("sha1").update(content).digest("hex");
                        return {
                            file: relativePath.replace(/\\/g, "/"), // Normalize to forward slashes
                            data: content,
                            sha,
                            size: content.length,
                        };
                    }
                })
            );
            return files.flat().filter(Boolean);
        };

        const vercelFiles = await collectFiles(rootPath);
        if (vercelFiles.length === 0) {
            return NextResponse.json({ error: "No valid files found for deployment" }, { status: 400 });
        }

        console.log("Files to be deployed:", vercelFiles.map((f) => f.file));

        console.log("Uploading files to Vercel...");
        await Promise.all(
            vercelFiles.map(async (file) => {
                await axios.post(
                    "https://api.vercel.com/v2/files",
                    file.data,
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/octet-stream",
                            "x-vercel-digest": file.sha,
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

        console.log("Deployment successful:", response.data);

        await fs.rm(extractPath, { recursive: true, force: true });

        return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};