import fs from "fs";
export class PostmanSync {
  private readonly configPath: string;
  constructor(configFile: string = "postman-sync.json") {
    const homedir = require("os").homedir();
    this.configPath = `${homedir}/${configFile}`;
  }
  public setApiKey(apiKey: string) {
    fs.writeFileSync(this.configPath, JSON.stringify({
      apiKey
    }), { encoding: "utf8" });
  }
  public getApiKey() {
    const homedir = require("os").homedir();
    const configContent = fs.readFileSync(this.configPath, {
      encoding: "utf8"
    });
    const config = JSON.parse(configContent.toString()) as {
      apiKey: string;
    };
    return config.apiKey;
  }
}
