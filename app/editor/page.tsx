"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Play,
  X,
  Plus,
  MoreVertical,
} from "lucide-react";
import { WebContainerManager } from "../utils/webcontainer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Resizable } from "re-resizable";
import Editor, { useMonaco } from "@monaco-editor/react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

export default function CodeEditor() {
  const [code, setCode] = useState('console.log("Hello World")');
  const [output, setOutput] = useState("Hello World");
  const [showFileTree, setShowFileTree] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [activeFile, setActiveFile] = useState<string>("index.js");
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();

  // Configure Monaco editor on mount
  useEffect(() => {
    WebContainerManager.getInstance();
  },[]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("customDark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1B1F23",
          "editor.foreground": "#E1E4E8",
        },
      });
      monaco.editor.setTheme("customDark");
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    try {
      const editorValue = editorRef.current?.getValue() || "";
      setCode(editorValue); // Update code state with the latest editor value
      const output = await WebContainerManager.runCode(editorValue);
      setOutput(`Executing code...\n${editorValue}\n\nOutput:\n${output}`);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const fileSystem: FileNode[] = [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "index.js", type: "file" },
        { name: "utils.py", type: "file" },
      ],
    },
  ];

  const renderFileTree = (nodes: FileNode[], path = "") => {
    return nodes.map((node) => {
      const currentPath = `${path}/${node.name}`;
      if (node.type === "folder") {
        const isExpanded = expandedFolders.has(currentPath);
        return (
          <div key={currentPath}>
            <div
              className="flex items-center cursor-pointer py-1 px-2 hover:bg-[#2A2F35] rounded"
              onClick={() => setExpandedFolders((prev) => new Set(prev.has(currentPath) ? [...prev].filter(p => p !== currentPath) : [...prev, currentPath]))}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <Folder className="h-4 w-4 mr-2 text-[#7982a9]" />
              <span>{node.name}</span>
            </div>
            {isExpanded && node.children && <div className="ml-4">{renderFileTree(node.children, currentPath)}</div>}
          </div>
        );
      }
      return (
        <div
          key={currentPath}
          className={`flex items-center cursor-pointer py-1 px-2 rounded ml-6 ${
            activeFile === node.name ? "bg-[#2A2F35] text-white" : "hover:bg-[#2A2F35]"
          }`}
          onClick={() => setActiveFile(node.name)}
        >
          <File className="h-4 w-4 mr-2 text-[#7982a9]" />
          <span>{node.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#1E2227] text-white">
      {/* Top Navigation */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#2A2F35] bg-[#1B1F23]">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setShowFileTree(!showFileTree)}>
          <Folder className="h-4 w-4 mr-2" />
          Code Editor
        </Button>
        <Button variant="default" size="sm" className="bg-[#238636] hover:bg-[#2ea043]" onClick={handleRunCode}>
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        {showFileTree && (
          <Resizable defaultSize={{ width: 240, height: "100%" }} minWidth={200} maxWidth={400} enable={{ right: true }} className="border-r border-[#2A2F35] bg-[#1B1F23]">
            <ScrollArea className="h-full p-4">{renderFileTree(fileSystem)}</ScrollArea>
          </Resizable>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-[#2A2F35] px-4 py-2 bg-[#1E2227]">
            <span className="text-sm">{activeFile}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor height="100%" width="100%" defaultLanguage="javascript" defaultValue={code} onMount={handleEditorDidMount} />
          </div>
        </div>

        {/* Output Console */}
        {showConsole && (
          <Resizable defaultSize={{ width: 320, height: "100%" }} minWidth={200} maxWidth={800} enable={{ left: true }} className="border-l border-[#2A2F35] bg-[#1B1F23]">
            <div className="h-full flex flex-col">
              <div className="border-b border-[#2A2F35] p-2 flex justify-between">
                <span className="text-sm">Console</span>
                <Button variant="ghost" size="icon" onClick={() => setShowConsole(false)}>
                  <X className="h-4 w-4" />
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
      <footer className="h-6 border-t border-[#2A2F35] px-4 text-xs text-gray-400 bg-[#1B1F23] flex items-center">
        <span>JavaScript</span>
        {!showConsole && (
          <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setShowConsole(true)}>
            Show Console
          </Button>
        )}
      </footer>
    </div>
  );
}
