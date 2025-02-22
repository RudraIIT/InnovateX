"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  MessageCircle,
  Play,
  Sparkles,
  X
} from "lucide-react";
import { WebContainer } from "@webcontainer/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Terminal } from "xterm";
import { TerminalComponent } from "@/components/terminal";
import { ChatType } from "@prisma/client";
import { Input } from "@/components/ui/input";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface Chat {
  message: string;
  type: ChatType;
}

export default function CodeEditor() {
  const [code, setCode] = useState('console.log("Hello World")');
  const [output, setOutput] = useState("Hello World");
  const [showFileTree, setShowFileTree] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [activeFile, setActiveFile] = useState<string>("index.js");
  const [writeOnTerminal, setWriteOnTerminal] = useState<Terminal>();
  const [chats, setChats] = useState<Chat[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const wcRef = useRef<WebContainer>(null);

  // Configure Monaco editor on mount
  // useEffect(() => {
  //   WebContainerManager.getInstance();
  // },[]);

  useEffect(() => {
    const bootWebContainer = async () => {
      wcRef.current = await WebContainer.boot();
    };
    bootWebContainer();
  },[])

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    try {
      const editorValue = editorRef.current?.getValue() || "";
      setCode(editorValue); // Update code state with the latest editor value
      const wc = wcRef.current;
      if(!wc) return;
      await wc.mount({
        "index.js": {
          file: {
            contents: editorValue,
          },
        },
      });

      const process = await wc.spawn("node", ["./index.js"]);
      let output = "";

      process.output.pipeTo(new WritableStream({
        write: (chunk) => {
          output += chunk;
          setOutput(output);
          writeOnTerminal?.write(chunk);
        },
      }));
      setOutput(`Executing code...\n${editorValue}\n\nOutput:\n${output}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-grow"
      >
        {showFileTree && (
          <>
            <ResizablePanel
              defaultSize={100}
              className="border-r border-[#2A2F35] bg-[#1B1F23]"
            >
              <ScrollArea className="h-full p-4">{renderFileTree(fileSystem)}</ScrollArea>
            </ResizablePanel>
            <ResizableHandle/>
          </>
        )}
        <ResizablePanel defaultSize={450} className="border-b border-[#2A2F35] h-full">
          <ResizablePanelGroup direction="vertical" className="flex flex-col h-full">
            <ResizablePanel
              defaultSize={100}
              className="border-b border-[#2A2F35] bg-[#1B1F23] flex-grow"
            >
              <div className="flex flex-col h-full">
                <div className="border-b border-[#2A2F35] px-4 py-2 bg-[#1E2227]">
                  <span className="text-sm">{activeFile}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Editor height="100%" width="100%" defaultLanguage="javascript" defaultValue={code} onMount={handleEditorDidMount} />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              maxSize={70}
              className="border-b border-[#2A2F35] bg-[#1B1F23] relative"
            >
              <TerminalComponent setWriteOnTerminal={setWriteOnTerminal} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {showConsole && (
          <>
            <ResizableHandle/>
            <ResizablePanel
              defaultSize={150}
              className="border-l border-[#2A2F35] bg-[#1B1F23]"
              onResize={(size) => {if (size < 2) setShowConsole(false)}}
            >
              <div className="h-full flex flex-col">
                <div className="border-b border-[#2A2F35] p-2 flex justify-between">
                  <span className="text-sm">Chat</span>
                  <Button variant="ghost" size="icon" onClick={() => setShowConsole(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 p-4 flex flex-col relative h-full overflow-y-scroll">
                  <ScrollArea className="flex-1 p-4">
                    {chats.length === 0 && (
                      <div className="text-center text-gray-400">
                        Descrbe Your website to see result
                      </div>
                    )}
                    {chats.map((chat, index) => (
                      <div key={index} className="mb-5 flex items-start justify-start">
                        <div className="bg-[#2A2F35] p-2 rounded-full inline-block">
                          {chat.type === ChatType.PROMPT ? (
                            <MessageCircle className="h-5 w-5 text-[#7982a9]" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-[#238636]" />
                          )}
                        </div>
                        <div className={`ml-2 flex-grow px-5 ${chat.type === ChatType.PROMPT ? "bg-[#303030] py-2 rounded-full" : ""}`}>
                          <span className="text-sm">{chat.message}</span>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="flex items-center w-full">
                    <Input
                      placeholder="Describe here..."
                      className="flex-1 min-w-10"
                    />
                    <Button variant="default" size="sm" className="ml-2">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
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
