import {test,expect,vi,beforeEach } from 'vitest'
import { GET,POST } from "@/app/api/prompt/route"
import { NextResponse } from 'next/server';

let promptStore: Map<string, string>

beforeEach(() => {
    vi.resetAllMocks();
    promptStore = new Map<string, string>();
})

test("GET returns 400 if userId is missing", async () => {
    const request = new Request("http://localhost:3000/api/prompt")
    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'userId is required' })
})

test("GET returns prompt and remove it from store", async () => {
    const userId = "user123"
    promptStore.set(userId, "Test Prompt")

    const request = new Request(`http://localhost:3000/api/prompt?userId=${userId}`)
    const response = await GET(request,promptStore)

    expect(response.status).toBe(200)
    const json = await response.json()
    
    expect(json.prompt).toBe("Test Prompt")
    expect(promptStore.get(userId)).toBeUndefined()
})

test("GET returns null prompt if userId is not found", async() => {
    const request = new Request('http://localhost:3000/api/prompt?userId=nonexistent')
    const response = await GET(request,promptStore)

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.prompt).toBeNull()
})

test("POST returns 400 if userId is missing", async() => {
    const request = new Request("http://localhost:3000/api/prompt", {
        method: 'POST',
        body: JSON.stringify({ prompt: "Test Prompt" })
    });

    const response = await POST(request,promptStore)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'userId is required' })
})

test("POST returns 400 if prompt is not a string", async() => {
    const request = new Request("http://localhost:3000/api/prompt", {
        method: 'POST',
        body: JSON.stringify({ userId: "user123", prompt: 123 })
    });

    const response = await POST(request,promptStore)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Value must be a string' })
})

test("POST successfully stores prompt", async () => {
    const userId = "user123"
    const prompt = "New Test Prompt"

    const request = new Request("http://localhost:3000/api/prompt", {
        method: 'POST',
        body: JSON.stringify({ userId, prompt })
    });

    const response = await POST(request,promptStore)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty("message","Value updated successfully");
    expect(promptStore.get(userId)).toBe(prompt)
})

test("POST returns 500 if JSON parsing fails", async () => {
    const request = new Request("http://localhost:3000/api/prompt", {
        method: 'POST',
        body: 'invalid json'
    });
    
    const response = await POST(request,promptStore)
    expect(response.status).toBe(500)
    expect(await response.json()).toHaveProperty("error","Failed to update value")
})