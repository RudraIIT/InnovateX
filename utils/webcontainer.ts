import { WebContainer } from "@webcontainer/api";

export class WebContainerManager {
  private static instance: WebContainer | null = null;

  static async getInstance(): Promise<WebContainer> {
    if (!this.instance) {
      this.instance = await WebContainer.boot();
      console.log("WebContainer instance created");
      await this.setupFileSystem();
    }
    return this.instance;
  }

  static async installDependencies() {
    const installProcess = await this.instance?.spawn("npm", ["install"]);
    await this.instance?.fs.writeFile("/index.js","");
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
      "package.json": {
        file: {
          contents: `{
            "name": "webcontainer-project",
            "version": "1.0.0",
            "main": "index.js"
          }`,
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

    await webcontainer.fs.writeFile("index.js", code);
    const process = await webcontainer.spawn("node", ["index.js"]);

    let output = "";

    process.output.pipeTo(new WritableStream({
      write:(chunk) => {
        output += chunk;
        console.log(chunk);
      }
    }))
    

    await process.exit;
    console.log("Final Output:", output);
    return output;
  }
}