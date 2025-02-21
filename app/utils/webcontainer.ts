import { WebContainer } from "@webcontainer/api";

export class WebContainerManager {
  private static instance: WebContainer | null = null;

  static async getInstance(): Promise<WebContainer> {
    if (!this.instance) {
      this.instance = await WebContainer.boot();
      await this.setupFileSystem();
    }
    return this.instance;
  }

  static async installDependencies() {
    const installProcess = await this.instance?.spawn("npm", ["install"]);
    await installProcess?.exit; 
    console.log("Dependencies installed");
  }

  static async setupFileSystem(): Promise<void> {
    const webcontainer = await this.getInstance();

    await webcontainer.mount({
      "index.js": {
        file: {
          contents: `console.log("Hello from WebContainer!");`,
        },
      },
    });

    console.log("File system initialized");

    const process = await webcontainer.spawn("npm", ["init", "-y"]);
    await process.exit;
    console.log("NPM initialized");
  }

  static async runCode(code: string): Promise<string> {
    const webcontainer = await this.getInstance();

    await webcontainer.fs.writeFile("/index.js", code);
    // Execute the code
    const process = await webcontainer.spawn("node", ["/index.js"]);
    console.log("Running container...",process);

    let output = '';
    await process.output.pipeTo(new WritableStream({
        write(data) {
            output += data;
        }
    }));
    console.log("Output",output);
    return output;
  }
}
