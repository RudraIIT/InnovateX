import { expect, test, beforeAll, vi } from "vitest"
import { render } from "@testing-library/react"
import CodeEditor from "@/app/editor/page"
import WorkspacePage from "@/app/editor/[id]/page"

beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn();
});


test("Editor page", async () => {
    const { container } = render(<CodeEditor />)
    expect(container).toBeDefined()
})

test("Workspace page", async () => {
    const { container } = render(<WorkspacePage params={Promise.resolve({ id: "Testing" })} />)
    expect(container).toBeDefined()
})