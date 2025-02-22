"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebContainerManager } from "@/utils/webcontainer";
import "xterm/css/xterm.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamicHighlight = (text: string): string => {
  const commandRegex = /^\s*([\w-]+)(?=\s|$)/;
  const optionRegex = /(\s-\w|\s--\w[\w-]*)/g;
  const pathRegex = /(\/[^\s]+)/g;
  const errorRegex = /error|not found|permission denied/gi;
  let styledText = text;
  styledText = styledText.replace(commandRegex, "\x1b[1;97m$1\x1b[0m");
  styledText = styledText.replace(optionRegex, "\x1b[33m$1\x1b[0m");
  styledText = styledText.replace(pathRegex, "\x1b[34m$1\x1b[0m");
  styledText = styledText.replace(errorRegex, "\x1b[31m$&\x1b[0m");
  return styledText;
}

interface TerminalComponentProps {
  setWriteOnTerminal: Dispatch<SetStateAction<Terminal | undefined>>;
}

export const TerminalComponent: React.FC<TerminalComponentProps> = ({ setWriteOnTerminal }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termInstance = useRef<Terminal | null>(null);
  const inputBuffer = useRef<string>("");
  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({
      rows: 12,
      cols: 60,
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'monospace, "Fira Code", "Courier New"',
      theme: {
        background: "#0d1117",
        foreground: "#dcdcdc",
        cursor: "#00ff00",
        selectionBackground: "#555"
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln("\x1b[32mWelcome to InnovateX terminal!!\x1b[0m");

    term.onData(async (data: string) => {
      if (data === "\r") {
        // User pressed Enter, execute the code
        term.writeln("\r\n");
        const code = inputBuffer.current.trim();
        inputBuffer.current = "";
        if (code) {
          console.log("Executing:", code);
          const output = await WebContainerManager.runTerminalCommands(code);
          term.writeln("\x1b[37m" + output + "\x1b[0m");
          console.log("Output:", output);
        }
        term.write("$ ");
      } else if (data === "\u007F") {
        // Handle backspace
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        // Collect input
        inputBuffer.current += data;
        term.write(data);
      }
    });

    term.write("$ ");

    termInstance.current = term;
    setWriteOnTerminal(term);

    return () => {
      term.dispose();
      setWriteOnTerminal(undefined);
    };
  }, [setWriteOnTerminal]);

  return <div ref={terminalRef} className="w-full h-full absolute bottom-0" />;
}
