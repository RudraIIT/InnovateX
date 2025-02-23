import { test, expect, beforeEach, vi } from "vitest"
import { POST } from "@/app/api/modify/[codeId]/route"
import { db } from "@/lib/db"
import axios from "axios"
import { NextRequest } from "next/server"
import { parseResponse } from "@/helpers/parseResponse"; 

vi.mock("@/lib/db", () => ({
    db: {
        code: {
            findFirst: vi.fn(),
            update: vi.fn()
        },
        file: {
            upsert: vi.fn()
        },
        $transaction: vi.fn()
    }
}));

vi.mock("axios")

vi.mock("@/helpers/parseResponse", () => ({
    parseResponse: vi.fn().mockImplementation((llm_response) => ({
        files: [
            { name: "index.js", path: "index.js", content: "console.log('Modified');" }
        ],
        response: "Updated successfully",
        title: "Test Title"
    }))
}));

const createMockRequest = (url: string, method: string, body?: object) => {
    return new NextRequest(new URL(url), {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: body ? { "Content-Type": "application/json" } : {}
    });
};

beforeEach(() => {
    vi.resetAllMocks();
    process.env.AGENT_AI_API_KEY = "test_api_key";
})

test("Returns 400 if prompt or codeId is missing", async () => {
    const request = createMockRequest("http://localhost:3000/api/modify", "POST");
    const response = await POST(request, { params: Promise.resolve({ codeId: "" }) });

    expect(response.status).toBe(400);
})

test("Returns 500 if no code is found in database", async () => {
    vi.mocked(db.code.findFirst).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/modify?prompt=test", "POST")
    const response = await POST(request, { params: Promise.resolve({ codeId: "123" }) })

    expect(response.status).toBe(500)
})

test("Returns 200 on successful modification", async () => {
    vi.mocked(db.code.findFirst).mockResolvedValue({
        id: "123",
        title: "Test Code",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user_123",
        files: [
            {
                name: "index.js",
                path: "/index.js",
                content: "console.log('Test');"
            }
        ]
    } as Awaited<ReturnType<typeof db.code.findFirst>>);

    vi.mocked(axios.post).mockResolvedValue({
        data: {
            response: `<CodeParserFile>
                          <CodeParserName>index.js</CodeParserName>
                          <CodeParserPath>/index.js</CodeParserPath>
                          <CodeParserContent>console.log('Test');</CodeParserContent>
                       </CodeParserFile>`
        }
    });
    
    vi.mocked(parseResponse).mockReturnValue({
        files: [
            { name: "index.js", path: "/index.js", content: "console.log('Test');" }
        ],
        response: "Updated successfully",
        title: "Test Title"
    });

    vi.mocked(db.$transaction).mockResolvedValue(null)
    vi.mocked(db.code.update).mockResolvedValue({
        id: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Test Code",
        userId: "user_123",
    })

    const request = createMockRequest("http://localhost:3000/api/modify?prompt=MOdify", "POST")
    const response = await POST(request, { params: Promise.resolve({ codeId: "123" }) })

    expect(response.status).toBe(200)
})