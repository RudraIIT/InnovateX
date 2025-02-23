import {test,expect,vi,beforeEach } from 'vitest'
import { GET } from "@/app/api/prompt/route"

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




