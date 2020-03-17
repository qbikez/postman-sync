"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const collections_1 = require("./postman-api/collections");
class PostmanSync {
    constructor(config = "postman-sync.json") {
        if (typeof config === "string") {
            const configFile = config.replace("\\", "/");
            this.configPath = configFile;
            const isRelative = configFile.startsWith("./") || configFile.startsWith(".//");
            if (!isRelative) {
                const homedir = require("os").homedir();
                this.configPath = `${homedir}/${configFile}`;
            }
        }
        else {
            this.config = config;
        }
    }
    setApiKey(apiKey) {
        if (!this.configPath)
            throw new Error("cannot set api key without configPath");
        fs_1.default.writeFileSync(this.configPath, JSON.stringify({
            apiKey
        }), { encoding: "utf8" });
    }
    getApiKey() {
        if (this.configPath) {
            if (!fs_1.default.existsSync(this.configPath)) {
                throw new Error(`Config file ${this.configPath} not found. Please run 'set-api-key' command to configure.`);
            }
            const configContent = fs_1.default.readFileSync(this.configPath, {
                encoding: "utf8"
            });
            const config = JSON.parse(configContent.toString());
            return config.apiKey;
        }
        else if (this.config) {
            return this.config.apiKey;
        }
        throw new Error("neither configPath nor config set");
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
        const serverCollections = await api.getCollections();
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
                await api.createCollection(col);
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
        const serverCollections = await api.getCollections();
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
        return new collections_1.PostmanApi(this.getApiKey());
    }
    removeMeta(obj, key) {
        for (const prop in obj) {
            if (prop === key)
                delete obj[prop];
            else if (typeof obj[prop] === 'object')
                this.removeMeta(obj[prop], key);
        }
    }
}
exports.PostmanSync = PostmanSync;
