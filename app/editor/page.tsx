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
import { WebContainerManager } from "@/utils/webcontainer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Terminal } from "xterm";
import { TerminalComponent } from "@/components/terminal";
import { ChatType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { getFileLanguage } from "@/helpers/Editor/fileLanguage";
import { setPrismaLanguage } from "@/helpers/Editor/customLanguage";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

interface Chat {
  message: string;
  type: ChatType;
}

export default function CodeEditor() {
  const [prompt, setPrompt] = useState<string>("");
  const [title, setTitle] = useState<string>("Untitled");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState("Hello World");
  const [showFileTree, setShowFileTree] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [activeFile, setActiveFile] = useState<string>("");
  const [writeOnTerminal, setWriteOnTerminal] = useState<Terminal>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [fileSystem, setFileSystem] = useState<FileNode[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const wcRef = useRef<WebContainer>(null);
  const convertToFileNode = (files: { name: string; path: string; content: string }[]): FileNode[] => {
    const fileMap: { [key: string]: FileNode } = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      let currentLevel = fileMap;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            type: index === parts.length - 1 ? "file" : "folder",
            children: index === parts.length - 1 ? undefined : [],
            content: index === parts.length - 1 ? file.content : undefined,
          };
        }

        if (index !== parts.length - 1) {
          currentLevel = currentLevel[part].children as unknown as { [key: string]: FileNode };
        }
      });
    });

    const buildTree = (nodes: { [key: string]: FileNode }): FileNode[] => {
      const nodeArray = Object.values(nodes).map((node) => {
        if (node.children) {
          node.children = buildTree(node.children as unknown as { [key: string]: FileNode });
        }
        return node;
      });

      nodeArray.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "folder" ? -1 : 1;
      });

      return nodeArray;
    };

    return buildTree(fileMap);
  };
  const findFileContent = (fileSystem: FileNode[], fileName: string): string | null => {
    for (const node of fileSystem) {
      if (node.type === "file" && node.name === fileName) {
        return node.content || null;
      } else if (node.type === "folder" && node.children) {
        const result = findFileContent(node.children, fileName);
        if (result) return result;
      }
    }
    return null;
  };
  const generateCode = async () => {
    const lastChat = chats[chats.length - 1];
    if (lastChat.type === ChatType.RESPONSE) return;
    const prompt = lastChat.message;
    if (!prompt) return;
    const toastId = toast.loading("Thinking...");
    try {
      const { data : { id } } = await axios.get(`/api/steps?prompt=${prompt}`);
      toast.loading("Generating code...", { id: toastId });
      const { data: { response : { title, files, response } } } = await axios.get(`/api/generate?prompt=${prompt}&steps=${id}`);
      setTitle(title);
      addChat(response, ChatType.RESPONSE);
      const fileNodes = convertToFileNode(files);
      setFileSystem(fileNodes);
      toast.success("Code generated", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate code", { id: toastId });
    }
  }
  const addChat = (message: string, type: ChatType) => {
    setChats((prev) => [...prev, { message, type }]);
    setPrompt("");
  };

  useEffect(() => {
    generateCode();
  }, [chats]);

  useEffect(() => {
    setCode(() => {
      const content = findFileContent(fileSystem, activeFile);
      return content || "";
    })
  },[activeFile, fileSystem])
  // const wcRef = useRef<WebContainer>(null);

  // Configure Monaco editor on mount
  useEffect(() => {
    WebContainerManager.getInstance();
  },[]);

  // useEffect(() => {
  //   const bootWebContainer = async () => {
  //     wcRef.current = await WebContainer.boot();
  //   };
  //   bootWebContainer();
  // },[])

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

  const handleEditorWillMount = (monaco: Monaco) => {
    setPrismaLanguage(monaco);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React, // Enable React JSX
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      declare namespace JSX {
        interface IntrinsicElements {
          [elemName: string]: any;
        }
      }
    `, 'file:///node_modules/@types/react/index.d.ts');
  };


  const handleRunCode = async () => {
    try {
      const editorValue = editorRef.current?.getValue() || "";
      setCode(editorValue); // Update code state with the latest editor value
      const output = await WebContainerManager.runCode(editorValue);
      writeOnTerminal?.write(output);
      writeOnTerminal?.write("$ ");
      setOutput(`Executing code...\n${editorValue}\n\nOutput:\n${output}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

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
              {!fileSystem.length && <div className="flex items-center justify-center h-full text-gray-400">
                No files found
                </div>}
              {fileSystem.length && <ScrollArea className="h-full p-4">{renderFileTree(fileSystem)}</ScrollArea>}
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
                  {!activeFile && <div className="flex items-center justify-center h-full text-gray-400">Select a file to view</div>}
                  {activeFile && <Editor
                    height="100%"
                    width="100%"
                    language={getFileLanguage(activeFile)}
                    value={code}
                    onMount={handleEditorDidMount}
                    beforeMount={handleEditorWillMount}
                    theme="vs-dark"
                    options={{
                      wordWrap: "on",
                      formatOnType: true,
                      formatOnPaste: true,
                      minimap: { enabled: true },
                      automaticLayout: true,
                      scrollBeyondLastLine: false
                    }}
                  />}
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
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1 min-w-10"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="ml-2"
                      onClick={() => addChat(prompt, ChatType.PROMPT)}
                    >
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
