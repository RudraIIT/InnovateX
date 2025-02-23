"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code,
  File,
  Folder,
  LoaderIcon,
  Maximize,
  MessageCircle,
  Minimize,
  Play,
  Rocket,
  Sparkles,
  X
} from "lucide-react";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Terminal } from "@xterm/xterm";
import { TerminalComponent } from "@/components/terminal";
import { ChatType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { getFileLanguage } from "@/helpers/Editor/fileLanguage";
import { setPrismaLanguage } from "@/helpers/Editor/customLanguage";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { baseConfig } from "@/helpers/baseConfig";
import { createCode, getCode } from "@/actions/code";
import { generateCode as masterAgent } from "@/agents/master";
import { UserButton, useUser } from "@clerk/nextjs";
import { TerminalDrawer } from "./terminal-drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { fetchProjectTree } from "@/utils/zip";
import { generateSlug } from 'random-word-slugs';
import Link from "next/link";
import { Loader } from "./loading-screen";
import { Textarea } from "./ui/textarea";

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

interface WorkspaceProps {
  initialId?: string;
  template?: string;
}

export const Workspace : React.FC<WorkspaceProps> = ({ initialId, template }) => {
  const [id, setId] = useState<string | undefined>(initialId);
  const [prompt, setPrompt] = useState<string>("");
  const [title, setTitle] = useState<string>("Untitled");
  const [code, setCode] = useState<string>("");
  const [showFileTree, setShowFileTree] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [activeFilePath, setActiveFilePath] = useState<string>("");
  const [writeOnTerminal, setWriteOnTerminal] = useState<Terminal>();
  const [chats, setChats] = useState<Chat[]>(template ? [{ message: "Template Initialized", type: ChatType.PROMPT }, { message: "Give me prompt to modify code", type: ChatType.RESPONSE }] : []);
  const [fileSystem, setFileSystem] = useState<FileNode[]>([]);
  const [tabValue, setTabValue] = useState<"editor" | "preview">("editor");
  const [startingDevServer, setStartingDevServer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [maxView, setMaxView] = useState(false);
  const [orgFileSystem, setOrgFileSystem] = useState<FileNode[]>([]);
  const [wcInitialized, setWcInitialized] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string>("");
  const [progressMaster, setProgressMaster] = useState(0);
  const [progressFrontend, setProgressFrontend] = useState(0);
  const [progressBackend, setProgressBackend] = useState(0);
  const [progressDatabase, setProgressDatabase] = useState(0);
  const [progressManager, setProgressManager] = useState(0);
  const [generatingCode, setGeneratingCode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const monaco = useMonaco();
  const wcRef = useRef<WebContainer>(null);
  const { user } = useUser();
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
  const convertToFileSystemTree = (nodes: FileNode[]): FileSystemTree => {
    const result: FileSystemTree = {};

    nodes.forEach((node) => {
      if (node.type === "folder" && node.children) {
        result[node.name] = {
          directory: convertToFileSystemTree(node.children),
        };
      } else if (node.type === "file") {
        result[node.name] = {
          file: {
            contents: node.content || "",
          },
        };
      }
    });

    return result;
  };
  const findFileContent = (fileSystem: FileNode[], path: string): string | null => {
    if (path[0] === "/") path = path.slice(1);
    const parts = path.split("/");
    for (const node of fileSystem) {
      if (node.name === parts[0]) {
        if (parts.length === 1) {
          return node.content ?? null;
        }
        if (node.type === "folder" && node.children) {
          return findFileContent(node.children, parts.slice(1).join("/"));
        }
      }
    }
    return null;
  };
  const updateFileSystem = (fileSystem: FileNode[], files: { name: string, path: string, content : string}[]) : FileNode[] => {
    const newFileSystem = [...fileSystem];
    files.forEach((file) => {
      const parts = file.path.split("/");
      let currentLevel = newFileSystem;

      parts.forEach((part, index) => {
        const existingNode = currentLevel.find((node) => node.name === part);

        if (existingNode) {
          if (index === parts.length - 1) {
            existingNode.content = file.content;
          } else if (existingNode.type === "folder" && existingNode.children) {
            currentLevel = existingNode.children;
          }
        } else {
          const newNode: FileNode = {
            name: part,
            type: index === parts.length - 1 ? "file" : "folder",
            content: index === parts.length - 1 ? file.content : undefined,
            children: index === parts.length - 1 ? undefined : [],
          };
          currentLevel.push(newNode);
          if (newNode.type === "folder" && newNode.children) {
            currentLevel = newNode.children;
          }
        }
      });
    });
    return newFileSystem;
  }
  const generateCode = async () => {
    const lastChat = chats[chats.length - 1];
    if (lastChat.type === ChatType.RESPONSE) return;
    const prompt = lastChat.message;
    if (!prompt) return;
    const toastId = toast.loading("Thinking...");
    try {
      if (chats.length == 1) {
        // const { data : { id } } = await axios.get(`/api/steps?prompt=${prompt}`);
        // toast.loading("Generating code...", { id: toastId });
        // const { data: { response : { title, files, response }, id : codeId} } = await axios.get(`/api/generate?prompt=${prompt}&steps=${id}`);
        setGeneratingCode(true);
        const { response : { title, files, response }, id : codeId } = await masterAgent(
          prompt,
          toastId,
          setProgressMaster,
          setProgressBackend,
          setProgressFrontend,
          setProgressDatabase,
          setProgressManager
        );
        setGeneratingCode(false);
        setTitle(title);
        addChat(response, ChatType.RESPONSE);
        const fileNodes = convertToFileNode(files);
        setFileSystem(fileNodes);
        toast.success("Code Generated", { id: toastId });
        setId(codeId);
      } else {
        toast.loading("Modifying code...", { id: toastId });
        const { data: { response : { title, files, response } } } = await axios.post(`/api/modify/${id}?prompt=${prompt}`);
        if (title) setTitle(title);
        addChat(response, ChatType.RESPONSE);
        const packageJsonFile: { name: string; path: string; content: string } | undefined = files.find((file: { name: string; path: string; content: string }) => file.name === "package.json");
        if (packageJsonFile) {
          setPreviewUrl("");
          startDevServer();
        }
        const newFileSystem = updateFileSystem(fileSystem, files);
        setFileSystem(newFileSystem);
        toast.success("Code Modified", { id: toastId });
      }
      setTabValue("preview");
    } catch (error) {
      toast.error("Failed to generate code", { id: toastId });
    }
  }

  const addChat = (message: string, type: ChatType) => {
    setChats((prev) => [...prev, { message, type }]);
    setPrompt("");
  };
  const compareFileSystem = (fs1: FileNode[], fs2: FileNode[]) => {
    if (fs1.length !== fs2.length) return false;
    for (let i = 0; i < fs1.length; i++) {
      if (fs1[i].name !== fs2[i].name || fs1[i].type !== fs2[i].type) return false;
      if (fs1[i].type === "file" && fs1[i].content !== fs2[i].content) return false;
      if (fs1[i].type === "folder" && fs1[i].children && fs2[i].children && !compareFileSystem(fs1[i].children ?? [], fs2[i].children ?? [])) return false;
    }
    return true;
  }
  const findNameUsingPath = (fileSystem: FileNode[], path: string): string | null => {
    if (path[0] === "/") path = path.slice(1);
    const parts = path.split("/");
    for (const node of fileSystem) {
      if (node.name === parts[0]) {
        if (parts.length === 1) {
          return node.name;
        }
        if (node.type === "folder" && node.children) {
          return findNameUsingPath(node.children, parts.slice(1).join("/"));
        }
      }
    }
    return null;
  }
  const handleCodeChange = (value: string | undefined) => {
    console.log("handleCodeChange", value);
    if (value === undefined) return;
    // setCode(value);
    if (orgFileSystem.length === 0) setOrgFileSystem(fileSystem);
    let updatedFilePath = activeFilePath;
    if (!updatedFilePath) {
      console.log("No active file path");
      return;
    }
    if (updatedFilePath[0] === "/") updatedFilePath = updatedFilePath.slice(1);
    console.log("Updated File Path", updatedFilePath);
    const fileName = findNameUsingPath(fileSystem, updatedFilePath);
    if (!fileName) {
      console.log("File not found");
      return;
    }
    console.log("File Name", fileName);
    const newFileSystem = updateFileSystem(fileSystem, [{ name: fileName, path: updatedFilePath, content: value }]);
    if (!compareFileSystem(fileSystem, newFileSystem)) {
      setFileSystem(newFileSystem);
    } else {
      setOrgFileSystem([]);
    }
    wcRef.current?.fs.writeFile(updatedFilePath, value);
    setCode(value);
  }

  useEffect(() => {
    const getInitPrompt = async () => {
      const {data : { prompt }} = await axios.get(`/api/prompt?userId=${user?.id}`);
      if (!prompt) return;
      addChat(prompt, ChatType.PROMPT);
    }
    getInitPrompt();
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chats, showConsole])

  useEffect(() => {
    generateCode();
  }, [chats]);

  useEffect(() => {
    setCode(() => {
      const content = findFileContent(fileSystem, activeFilePath);
      return content || "";
    })
  },[activeFilePath, fileSystem])

  useEffect(() => {
    (async () => {
      wcRef.current = await WebContainer.boot();
      console.log("WebContainer initialized");
      setWcInitialized(true);
    })();
    (async () => { if (template) {
        const projectFiles = await fetchProjectTree(template);
        console.log("Project files fetched", projectFiles);
        const { data, error } = await createCode({
          title: template,
          files: projectFiles,
          response: chats[1].message
        }, chats[0].message);
        console.log('Error', error);
        if (!error && data) {
          setId(data.id);
          setTitle(template);
          setFileSystem(convertToFileNode(projectFiles));
        } else {
          toast.error("Failed to create code");
          setChats([]);
        }
      }
    })()
    if (id) {
      const fetchCode = async () => {
        const { data, error } = await getCode(id);
        if (error) {
          console.error("Error in fetchCode:", error);
          toast.error('Failed to fetch code');
          return;
        }
        if (!data) {
          console.error("No data found");
          toast.error('No data found');
          return;
        }
        const { title, files, chat } = data;
        setTitle(title);
        setFileSystem(convertToFileNode(files));
        setChats(chat);
      };
      fetchCode();
    }
  },[])

  useEffect(() => {
    ( async () => {if (wcRef.current && !startingDevServer) {
      const fsTree = {
        ...convertToFileSystemTree(fileSystem),
        ...baseConfig,
      }
      await wcRef.current.mount(fsTree);
    }
  })()
  }, [fileSystem, wcRef.current, startingDevServer])

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

  // useEffect(() => {
  //   if (tabValue === "preview") {
  //     console.log("Starting Dev Server");
  //     startDevServer();
  //   }
  // }, [tabValue, wcRef.current]);

  useEffect(() => {
    console.log("tabValue", tabValue);
    console.log("previewUrl", previewUrl);
    console.log("wcRef.current", wcRef.current);
    if (wcRef.current && tabValue === "preview" && !previewUrl) {
      console.log("Starting Dev Server");
      startDevServer();
    }
  }, [wcRef.current, tabValue, previewUrl]);

  useEffect(() => {
    console.log("webContainer", wcRef.current);
  }, [wcRef.current])

  const startDevServer = async () => {
    if (startingDevServer || previewUrl) return;
    if (!wcRef.current) {
      console.error("WebContainer not initialized");
      return;
    }
    if (!fileSystem) {
      console.error("File System not initialized");
      return;
    }
    if (!writeOnTerminal) {
      console.error("Terminal failed to initialize");
      toast.error("Terminal failed to initialize");
      return;
    }
    setStartingDevServer(true);
    try {
      const fsTree = {
        ...convertToFileSystemTree(fileSystem),
        ...baseConfig,
      }
      await wcRef.current.mount(fsTree);
      const packageJson = await wcRef.current.fs.readFile('package.json', 'utf-8').catch(() => null);
      if (!packageJson) {
        throw new Error("package.json not found");
      }
      writeOnTerminal.write('> \x1b[33mnpm\x1b[0m \x1b[97minstall\x1b[0m\r\n');
      const installDependencies = await wcRef.current.spawn('npm', ['install']);
      installDependencies.output.pipeTo(new WritableStream({
        write(chunk) {
          writeOnTerminal.write('\r'+chunk);
        }
      }));
      const exitCode = await installDependencies.exit;
      if (exitCode !== 0) {
        throw new Error("Failed to install dependencies");
      }
      writeOnTerminal.write('> \x1b[33mnpm\x1b[0m \x1b[97mrun dev\x1b[0m\r\n');
      const startProcess = await wcRef.current.spawn('npm', ['run', 'dev']);
      startProcess.output.pipeTo(new WritableStream({
        write(chunk) {
          writeOnTerminal.write('\r\n'+chunk);
        }
      }));
      wcRef.current.on('server-ready', (_port, url) => {
        setPreviewUrl(url);
      });
    } catch (error : any) {
      console.error("Error in startDevServer:", error);
      toast?.error(error?.message || "Failed to start development server");
    }
    setStartingDevServer(false);
  };

  const saveAndDeploy = async () => {
      try {
          const formData = new FormData();
          const blob = new Blob([JSON.stringify(fileSystem)], { type: "application/json" });
          formData.append("fileSystem", blob, "fileSystem.json");
          console.log("fileSystem", fileSystem);
          formData.append("projectName", generateSlug());
  
          const response = await fetch("/api/deploy", {
              method: "POST",
              body: formData,
          });
        

          if (!response.ok) {
              throw new Error(`Deployment failed: ${response.statusText}`);
          }

          const result = await response.json();
          console.log('Url', result.url);
          setDeployedUrl(result.url);
          toast.success(`Deployment successful visit ${result.url} to view the project`);
          setDeploying(false);
      } catch (error) {
          console.error("Error in saveAndDeploy:", error);
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
            activeFilePath === currentPath ? "bg-[#2A2F35] text-white" : "hover:bg-[#2A2F35]"
          }`}
          onClick={() => {
            setActiveFilePath(currentPath)
            setTabValue("editor")
          }}
        >
          <File className="h-4 w-4 mr-2 text-[#7982a9]" />
          <span>{node.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-full flex flex-col text-white">
      {generatingCode && <div className="h-lvh w-lvw backdrop-blur-sm flex justify-center items-center z-50 fixed top-0 left-0">
        <Loader
          progress0={progressMaster}
          progress1={progressDatabase}
          progress2={progressBackend}
          progress3={progressFrontend}
          progress4={progressManager}
        />
      </div>}
        <Button variant="default" size="sm" className={`mt-14 fixed left-2 hidden md:${showFileTree ? 'hidden' : 'block'}`} onClick={() => setShowFileTree(true)}>
          <Folder className="h-4 w-4" />
        </Button>

        <header className="h-12 flex items-center justify-between px-4 border-b border-[#2A2F35] w-full">
          <div className="flex items-center gap-4 min-w-0">
          <Link href="/dashboard">
            <span className="leading-7 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-lg font-semibold whitespace-nowrap">
              InnovateX
            </span>
          </Link>
          </div>

          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Button
              variant="default"
              size="sm"
              className="bg-[#238636] hover:bg-[#2ea043] text-white md:min-w-[100px] flex items-center justify-center transition-colors duration-200"
              onClick={() => {
                if (tabValue === "editor") setTabValue("preview");
                else setTabValue("editor");
              }}
              disabled={!wcInitialized}
            >
              {tabValue === "editor" && (
                <>
                  <Play className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:block">Preview</span>
                </>
              )}
              {tabValue === "preview" && (
                <>
                  <Code className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:block">Code</span>
                </>
              )}
            </Button>
            <div className="block md:hidden">
              <TerminalDrawer setWriteOnTerminal={setWriteOnTerminal} />
            </div>
            <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Folder className="h-4 w-4" />
              </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mx-auto w-full max-w-sm">
                  <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                    {!fileSystem.length && <div className="flex items-center justify-center h-full text-gray-400">
                      No files found
                      </div>}
                    {fileSystem.length && <ScrollArea className="h-full p-4">{renderFileTree(fileSystem)}</ScrollArea>}
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant={'outline'} className={`${deployedUrl.length > 0 ? 'block' : 'hidden'}`} size="sm" >  <Link href={`https://${deployedUrl}`} target="_blank">
              <span className="h-4 w-4">🔗</span>
            </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (deploying) return;
                setDeploying(true);
                saveAndDeploy();
              } }
              disabled={fileSystem.length === 0 || deploying}
              className="bg-gradient-to-r from-[#2A2F35] to-[#3D444C] hover:from-[#3D444C] hover:to-[#2A2F35] text-white md:min-w-[120px] flex items-center justify-center transition-all duration-200"
            >
              <Rocket className={`h-4 w-4  md:mr-2 ${deploying ? 'hidden' : 'block'}`} />
              <LoaderIcon className={`w-6 h-6 mr-2 animate-spin ${deploying ? 'block' : 'hidden'}`} />
              <span className="hidden md:block">{deploying ? 'Deploying' : 'Deploy Now'}</span>
            </Button>
            <UserButton />
          </div>
        </header>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-grow"
      >
        {showFileTree && (
          <>
            <ResizablePanel
              onResize={(size) => {if (size < 5) setShowFileTree(false)}}
              defaultSize={120}
              className="border-r border-[#2A2F35] hidden md:block"
            >
              {!fileSystem.length && <div className="hidden: md:block flex items-center justify-center h-full text-gray-400">
                No files found
                </div>}
              {fileSystem.length && <ScrollArea className="h-full p-4 hidden md:block">{renderFileTree(fileSystem)}</ScrollArea>}
            </ResizablePanel>
            <ResizableHandle/>
          </>
        )}
        <ResizablePanel defaultSize={450} className="border-b border-[#2A2F35] h-full">
          <ResizablePanelGroup direction="vertical" className="flex flex-col h-full">
            <ResizablePanel
              defaultSize={100}
              className="border-b border-[#2A2F35] flex-grow"
            >
              <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as "editor" | "preview")} className="h-full">
                <TabsContent value="editor" className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="border-b border-[#2A2F35] px-4 py-2">
                      <span className="text-sm">{activeFilePath ? activeFilePath.split("/")?.pop() || '' : ''}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {!activeFilePath && <div className="flex items-center justify-center h-full text-gray-400">Select a file to view</div>}
                      {activeFilePath && <Editor
                        height="100%"
                        width="100%"
                        language={getFileLanguage(activeFilePath?.split("/")?.pop() || '')}
                        value={code}
                        onChange={(value) => handleCodeChange(value || "")}
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
                </TabsContent>
                <TabsContent value="preview" className="h-full">
                  <div className={`h-full ${maxView ? "fixed inset-0 z-50" : "relative"}`}>
                    {!previewUrl && (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Starting development server...
                      </div>
                    )}
                    {previewUrl && (
                      <>
                        <iframe src={previewUrl} className="w-full h-full bg-white" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-4 right-4"
                          onClick={() => setMaxView((prev) => !prev)}
                        >
                          {maxView ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              maxSize={70}
              className="border-b border-[#2A2F35] relative hidden md:block"
            >
              <div className="hidden md:block">
              <TerminalComponent setWriteOnTerminal={setWriteOnTerminal} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {showConsole && (
          <>
            <ResizableHandle/>
            <ResizablePanel
              defaultSize={150}
              className="border-l border-[#2A2F35] hidden md:block"
              onResize={(size) => {if (size < 5) setShowConsole(false)}}
            >
              <div className="h-full flex-col hidden md:flex">
                <div className="border-b border-[#2A2F35] p-2 flex items-center justify-between">
                  <span className="text-2xl font-semibold bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent flex-1 text-center">
                    Chat
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConsole(false)}
                    className="text-gray-400 hover:text-white hover:bg-[#2A2F35] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 p-4 flex flex-col relative h-full overflow-y-scroll">
                  <div  className="flex-1 p-4 overflow-y-scroll" ref={chatRef}>
                    {chats.length === 0 && (
                      <div className="text-center text-gray-400">
                        Describe Your website to see result
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
                        <div className={`ml-4 flex-grow px-5 ${chat.type === ChatType.PROMPT ? "bg-[#303030] py-2 rounded-xl" : ""}`}>
                          <span className="text-sm">{chat.message}</span>
                        </div>
                      </div>
                    ))}
                    {chats.length > 0 && chats[chats.length - 1].type === ChatType.PROMPT && (
                      <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center w-full gap-2">
                  <Textarea
                    className="h-28 rounded-lg px-4 py-4 text-sm text-left align-top leading-normal placeholder:text-left"
                    placeholder="Your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
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
      <Button
          variant="default"
          className={`fixed bottom-8 h-12 w-12 right-6 z-10 p-4 rounded-full shadow-lg bg-[#238636] hover:bg-[#2ea043] text-white transition-all duration-200 hidden md:${
            showConsole ? 'hidden' : 'block'
          }`}
          onClick={() => setShowConsole(true)}
        >
          <MessageCircle size='10' />
        </Button>
        <div className="block md:hidden">
        <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="fixed bottom-8 right-6 p-4 rounded-full shadow-lg bg-[#238636] hover:bg-[#2ea043] text-white"><MessageCircle className="h-4 w-4"/></Button>
        </SheetTrigger>
        <SheetContent>
          <div className="mx-auto w-full max-w-sm">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="h-full flex flex-col">
                  <div className="border-b border-[#2A2F35] p-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent flex-1 text-center">
                      Chat
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col relative h-full overflow-y-scroll">
                    <div  className="flex-1 p-4 overflow-y-scroll" ref={chatRef}>
                      {chats.length === 0 && (
                        <div className="text-center text-gray-400">
                          Describe Your website to see result
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
                          <div className={`ml-4 flex-grow px-5 ${chat.type === ChatType.PROMPT ? "bg-[#303030] py-2 rounded-xl" : ""}`}>
                            <span className="text-sm">{chat.message}</span>
                          </div>
                        </div>
                      ))}
                      {chats.length > 0 && chats[chats.length - 1].type === ChatType.PROMPT && (
                        <div className="bouncing-loader">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              <SheetFooter>
                <div className="flex flex-col items-center w-full gap-4">
                      <Input
                        placeholder="Your prompt here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 min-h-12 min-w-10"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => addChat(prompt, ChatType.PROMPT)}
                      >
                        Send
                      </Button>
                  </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
      </div>
      <footer className="h-6 border-t border-[#2A2F35] px-4 text-xs text-gray-400 bg-[#1B1F23] flex items-center justify-center relative">
        <span className="absolute left-4">{activeFilePath ? getFileLanguage(activeFilePath.split("/")?.pop() || '') : "No File"}</span>
        {title && title != 'Untitled' && <span>{title}</span>}
      </footer>
    </div>
  );
}
