"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Play,
  X,
  Plus,
  MoreVertical,
  Settings,
  Bell,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Resizable } from "re-resizable"
import Editor, { useMonaco } from "@monaco-editor/react"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

export default function CodeEditor() {
  const [code, setCode] = useState('print("Hello World")')
  const [output, setOutput] = useState("Hello World")
  const [showFileTree, setShowFileTree] = useState(true)
  const [showConsole, setShowConsole] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]))
  const editorRef = useRef(null)
  const monaco = useMonaco()

  // Configure Monaco editor on mount
  useEffect(() => {
    if (monaco) {
      // Set the editor theme
      monaco.editor.defineTheme("customDark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1B1F23",
          "editor.foreground": "#E1E4E8",
          "editor.lineHighlightBackground": "#2A2F35",
          "editor.selectionBackground": "#2A2F3577",
          "editorCursor.foreground": "#E1E4E8",
          "editorWhitespace.foreground": "#2A2F35",
          "editorIndentGuide.background": "#2A2F35",
        },
      })
      monaco.editor.setTheme("customDark")
    }
  }, [monaco])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const fileSystem: FileNode[] = [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "main.py", type: "file" },
        { name: "utils.py", type: "file" },
      ],
    },
    {
      name: "assets",
      type: "folder",
      children: [{ name: "generated-icon.png", type: "file" }],
    },
    {
      name: "packager",
      type: "folder",
      children: [
        { name: "pyproject.toml", type: "file" },
        { name: "uv.lock", type: "file" },
      ],
    },
  ]

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleRunCode = () => {
    try {
      // In a real app, this would send the code to a backend for execution
      setOutput(`Executing code...\n${code}\n\nOutput:\nHello World`)
    } catch (error:any) {
      setOutput(`Error: ${error.message}`)
    }
  }

  const renderFileTree = (nodes: FileNode[], path = "") => {
    return nodes.map((node) => {
      const currentPath = `${path}/${node.name}`
      if (node.type === "folder") {
        const isExpanded = expandedFolders.has(currentPath)
        return (
          <div key={currentPath}>
            <div
              className="flex items-center text-gray-300 hover:text-white cursor-pointer py-1 px-2 hover:bg-[#2A2F35] rounded"
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
              )}
              <Folder className="h-4 w-4 mr-2 text-[#7982a9]" />
              <span className="text-sm">{node.name}</span>
            </div>
            {isExpanded && node.children && <div className="ml-4">{renderFileTree(node.children, currentPath)}</div>}
          </div>
        )
      }
      return (
        <div
          key={currentPath}
          className="flex items-center text-gray-300 hover:text-white cursor-pointer py-1 px-2 hover:bg-[#2A2F35] rounded ml-6"
        >
          <File className="h-4 w-4 mr-2 text-[#7982a9]" />
          <span className="text-sm">{node.name}</span>
        </div>
      )
    })
  }

  return (
    <div className="h-full w-full bg-[#1E2227] text-white flex flex-col">
      {/* Top Navigation */}
      <header className="h-12 border-b border-[#2A2F35] flex items-center justify-between px-4 bg-[#1B1F23]">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setShowFileTree(!showFileTree)}
          >
            <Folder className="h-4 w-4 mr-2" />
            RevolvingLightPlans
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            className="bg-[#238636] hover:bg-[#2ea043] text-white"
            onClick={handleRunCode}
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        {showFileTree && (
          <Resizable
            defaultSize={{ width: 240, height: "100%" }}
            minWidth={200}
            maxWidth={400}
            enable={{ right: true }}
            className="border-r border-[#2A2F35] bg-[#1B1F23] transition-all duration-200"
          >
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Files</span>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                {renderFileTree(fileSystem)}
              </div>
            </ScrollArea>
          </Resizable>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col bg-[#1B1F23]">
          <div className="border-b border-[#2A2F35] flex items-center">
            <div className="flex items-center px-4 py-2 border-r border-[#2A2F35] bg-[#1E2227]">
              <File className="h-4 w-4 mr-2 text-[#7982a9]" />
              <span className="text-sm">main.py</span>
              <Button variant="ghost" size="icon" className="ml-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              defaultValue={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                renderLineHighlight: "all",
                lineNumbers: "on",
                roundedSelection: true,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                tabSize: 2,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
        </div>

        {/* Output Console */}
        {showConsole && (
          <Resizable
            defaultSize={{ width: 320, height: "100%" }}
            minWidth={200}
            maxWidth={800}
            enable={{ left: true }}
            className="border-l border-[#2A2F35] bg-[#1B1F23] transition-all duration-200"
          >
            <div className="h-full flex flex-col">
              <div className="border-b border-[#2A2F35] p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm">Console</span>
                  <Button variant="ghost" size="icon" className="ml-2" onClick={() => setShowConsole(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <pre className="font-mono text-sm text-[#2ea043] whitespace-pre-wrap">{output}</pre>
              </ScrollArea>
            </div>
          </Resizable>
        )}
      </div>

      {/* Status Bar */}
      <footer className="h-6 border-t border-[#2A2F35] flex items-center justify-between px-4 text-xs text-gray-400 bg-[#1B1F23]">
        <div className="flex items-center space-x-4">
          <span>Python</span>
          <span>UTF-8</span>
        </div>
        {!showConsole && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowConsole(true)}>
            Show Console
          </Button>
        )}
      </footer>
    </div>
  )
}

