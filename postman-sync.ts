import fs from "fs";
import { PostmanApi, Collection } from "./postman-api";

interface PostmanSyncConfig {
  apiKey?: string;
  defaultWorkspace?: string;
}

export class PostmanSync {
  private readonly configPath?: string;
  public config: PostmanSyncConfig = {
    apiKey: undefined,
    defaultWorkspace: undefined
  };

  constructor(config: PostmanSyncConfig | string = "postman-sync.json") {
    if (typeof config === "string") {
      const configFile = config.replace("\\", "/");
      this.configPath = configFile;
      const isRelative =
        configFile.startsWith("./") || configFile.startsWith(".//");
      if (!isRelative) {
        const homedir = require("os").homedir();
        this.configPath = `${homedir}/${configFile}`;
      }
      this.loadConfig(true);
    } else {
      this.config = config;
    }
  }

  private loadConfig(isOptional: boolean = false): void {
    if (this.configPath) {
      if (!fs.existsSync(this.configPath)) {
        return;
        // throw new Error(
        //   `Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`
        // );
      }

      const configContent = fs.readFileSync(this.configPath, {
        encoding: "utf8"
      });
      const config = JSON.parse(configContent.toString()) as PostmanSyncConfig;
      this.config = config;
    }
  }

  public saveConfig(): void {
    if (this.configPath) {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config), {
        encoding: "utf8"
      });
    }
  }

  public getApiKey(): string {
    this.loadConfig();
    if (!this.config.apiKey) {
      throw new Error(
        `Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`
      );
    }
    return this.config.apiKey;
  }

  public async push(dir: string) {
    const api = this.getApi();
    const files = fs
      .readdirSync(dir)
      .filter(f => f.includes("postman_collection.json"));

    if (files.length === 0) {
      console.warn("no collections found");
      return;
    }

    const serverCollections = await api.getCollections(this.config.defaultWorkspace);
    const localCollections = files.map(filename => {
      const content = fs
        .readFileSync(`${dir}/${filename}`, { encoding: "utf-8" })
        .toString();
      return JSON.parse(content) as Collection;
    });

    for (const col of localCollections) {
      const serverCol = serverCollections.find(c => c.name === col.info.name);
      if (serverCol) {
        console.debug(`updating collection ${col.info.name}`);
        await api.updateCollection(serverCol.uid, col);
      } else {
        console.debug(`creating collection ${col.info.name}`);
        await api.createCollection(col, this.config.defaultWorkspace);
      }
    }
  }

  public async pull(dir: string) {
    const api = this.getApi();
    const files = fs
      .readdirSync(dir)
      .filter(f => f.includes("postman_collection.json"));

    if (files.length === 0) {
      console.warn("no collections found");
      return;
    }

    const serverCollections = await api.getCollections(this.config.defaultWorkspace);

    for (const filename of files) {
      const content = fs
        .readFileSync(`${dir}/${filename}`, { encoding: "utf-8" })
        .toString();
      const col = JSON.parse(content) as Collection;

      const info = serverCollections.find(c => c.name === col.info.name);
      if (!info) {
        console.warn(`could not find collection ${col.info.name} on server`);
        continue;
      }

      console.debug(`pulling ${filename}`);
      const serverCol = await api.getCollection(info.uid);
      this.removeMeta(serverCol, '_postman_id');
      
      fs.writeFileSync(
        `${dir}/${filename}`,
        JSON.stringify(serverCol, null, 2),
        "utf-8"
      );
    }
  }

  private getApi() {
    return new PostmanApi(this.getApiKey());
  }

  private removeMeta(obj: { [key: string]: any }, key: string) {
    for (const prop in obj) {
      if (prop === key) delete obj[prop];
      else if (typeof obj[prop] === "object") this.removeMeta(obj[prop], key);
    }
  }
}
