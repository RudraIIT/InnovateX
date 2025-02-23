import {test, expect, beforeEach, vi} from "vitest"
import {GET} from "@/app/api/projects/route"
import fs from "fs/promises"
import { NextRequest } from "next/server"

vi.mock("fs/promises")

const createMockRequest = (url:string) => {
    return {
        nextUrl: new URL(url),
    } as NextRequest
}

beforeEach(() => {
    vi.resetAllMocks();
})

test("Returns 400 if template parameter is missing", async () => {
    const request = createMockRequest("http://localhost:3000/api/projects")
    const response = await GET(request)

    expect(response.status).toBe(200)
    const json = await response.json();
    expect(json).toEqual({error: "Failed to generate project file list"});
})

test("Returns errr if directory processing fails", async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error("Read directory error"));

    const request = createMockRequest("http://localhost:3000/api/projects?template=example")
    const response = await GET(request)

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ error: "Failed to generate project file list"})
})