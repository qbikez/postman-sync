"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const postman_api_1 = require("./postman-api");
class PostmanSync {
    constructor(config = "postman-sync.json") {
        this.config = {
            apiKey: undefined,
            defaultWorkspace: undefined
        };
        if (typeof config === "string") {
            const configFile = config.replace("\\", "/");
            this.configPath = configFile;
            const isRelative = configFile.startsWith("./") || configFile.startsWith(".//");
            if (!isRelative) {
                const homedir = require("os").homedir();
                this.configPath = `${homedir}/${configFile}`;
            }
            this.loadConfig(true);
        }
        else {
            this.config = config;
        }
    }
    loadConfig(isOptional = false) {
        if (this.configPath) {
            if (!fs_1.default.existsSync(this.configPath)) {
                return;
                // throw new Error(
                //   `Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`
                // );
            }
            const configContent = fs_1.default.readFileSync(this.configPath, {
                encoding: "utf8"
            });
            const config = JSON.parse(configContent.toString());
            this.config = config;
        }
    }
    saveConfig() {
        if (this.configPath) {
            fs_1.default.writeFileSync(this.configPath, JSON.stringify(this.config), {
                encoding: "utf8"
            });
        }
    }
    getApiKey() {
        this.loadConfig();
        if (!this.config.apiKey) {
            throw new Error(`Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`);
        }
        return this.config.apiKey;
    }
    async push(dir) {
        const api = this.getApi();
        const files = fs_1.default
            .readdirSync(dir)
            .filter(f => f.includes("postman_collection.json"));
        if (files.length === 0) {
            console.warn("no collections found");
            return;
        }
        const serverCollections = await api.getCollections(this.config.defaultWorkspace);
        const localCollections = files.map(filename => {
            const content = fs_1.default
                .readFileSync(`${dir}/${filename}`, { encoding: "utf-8" })
                .toString();
            return JSON.parse(content);
        });
        for (const col of localCollections) {
            const serverCol = serverCollections.find(c => c.name === col.info.name);
            if (serverCol) {
                console.debug(`updating collection ${col.info.name}`);
                await api.updateCollection(serverCol.uid, col);
            }
            else {
                console.debug(`creating collection ${col.info.name}`);
                await api.createCollection(col, this.config.defaultWorkspace);
            }
        }
    }
    async pull(dir) {
        const api = this.getApi();
        const files = fs_1.default
            .readdirSync(dir)
            .filter(f => f.includes("postman_collection.json"));
        if (files.length === 0) {
            console.warn("no collections found");
            return;
        }
        const serverCollections = await api.getCollections(this.config.defaultWorkspace);
        for (const filename of files) {
            const content = fs_1.default
                .readFileSync(`${dir}/${filename}`, { encoding: "utf-8" })
                .toString();
            const col = JSON.parse(content);
            const info = serverCollections.find(c => c.name === col.info.name);
            if (!info) {
                console.warn(`could not find collection ${col.info.name} on server`);
                continue;
            }
            console.debug(`pulling ${filename}`);
            const serverCol = await api.getCollection(info.uid);
            fs_1.default.writeFileSync(`${dir}/${filename}`, JSON.stringify(serverCol, null, 2), "utf-8");
        }
    }
    getApi() {
        return new postman_api_1.PostmanApi(this.getApiKey());
    }
    removeMeta(obj, key) {
        for (const prop in obj) {
            if (prop === key)
                delete obj[prop];
            else if (typeof obj[prop] === "object")
                this.removeMeta(obj[prop], key);
        }
    }
}
exports.PostmanSync = PostmanSync;
