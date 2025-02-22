import { WebContainer } from "@webcontainer/api";

export class WebContainerManager {
  private static instance: WebContainer | null = null;

  static async getInstance(): Promise<WebContainer> {
    if (!this.instance) {
      this.instance = await WebContainer.boot();
      console.log("WebContainer instance created")
    }
    return this.instance;
  }


  static async runCode(code: string): Promise<string> {
    const webcontainer = await this.getInstance();

    await webcontainer.mount({
      "index.js": {
        file: {
          contents: code,
        },
      },
    })
    const process = await webcontainer.spawn("node", ["index.js"]);

    let output = "";

    process.output.pipeTo(new WritableStream({
      write:(chunk) => {
        output += chunk;
        console.log(chunk);
      }
    }))

    await process.exit;
    return output;
  }

  static async runTerminalCommands(commands: string): Promise<string> {
    const webcontainer = await this.getInstance();
    
    const process = await webcontainer.spawn("bash", ["-c", commands]);

    let output = "";

    process.output.pipeTo(new WritableStream({
      write:(chunk) => {
        output += chunk;
        console.log(chunk);
      }
    }))

    await process.exit;
    return output;
  }
}