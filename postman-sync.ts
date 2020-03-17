import fs from "fs";
import { PostmanApi, Collection } from "./postman-api/collections";
import { errorMonitor } from "events";

interface PostmanSyncConfig {
  apiKey: string;
}

export class PostmanSync {
  private readonly configPath?: string;
  private config?: PostmanSyncConfig;

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
    } else {
      this.config = config;
    }
  }

  public setApiKey(apiKey: string) {
    if (!this.configPath)
      throw new Error("cannot set api key without configPath");
    fs.writeFileSync(
      this.configPath,
      JSON.stringify({
        apiKey
      }),
      { encoding: "utf8" }
    );
  }

  public getApiKey() {
    if (this.configPath) {

      if (!fs.existsSync(this.configPath)) {
        throw new Error(`Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`);
      }

      const configContent = fs.readFileSync(this.configPath, {
        encoding: "utf8"
      });
      const config = JSON.parse(configContent.toString()) as PostmanSyncConfig;
      return config.apiKey;
    } else if (this.config) {
      return this.config.apiKey;
    }

    throw new Error("neither configPath nor config set");
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

    const serverCollections = await api.getCollections();
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
        api.updateCollection(serverCol.uid, col);
      } else {
        console.debug(`creating collection ${col.info.name}`);
        api.createCollection(col);
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

    const serverCollections = await api.getCollections();

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
}
