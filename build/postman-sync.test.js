"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postman_sync_1 = require("./postman-sync");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const apiKey = process.env.POSTMAN_API_KEY || "";
const testDir = "./.test-data";
describe("postman sync", () => {
    beforeAll(() => {
        if (!fs_1.default.existsSync(testDir)) {
            fs_1.default.mkdirSync(testDir);
        }
    });
    afterAll(() => {
        if (fs_1.default.existsSync(testDir)) {
            fs_1.default.rmdirSync(testDir, { recursive: true });
        }
    });
    it("should store api key", () => {
        const sync = new postman_sync_1.PostmanSync(`${testDir}/test-config.json`);
        const key = `test-${uuid_1.v4()}`;
        sync.setApiKey(key);
        const retrieved = sync.getApiKey();
        expect(retrieved).toBe(key);
    });
    it("push", async () => {
        const name = `test-collection-${uuid_1.v4()}`;
        const collection = {
            info: {
                name
            },
            item: []
        };
        fs_1.default.writeFileSync(`${testDir}/${name}.postman_collection.json`, JSON.stringify(collection), "utf-8");
        const sync = new postman_sync_1.PostmanSync({ apiKey });
        await sync.push(testDir);
    });
    it("pull", async () => {
        const sync = new postman_sync_1.PostmanSync({ apiKey });
        await sync.pull(testDir);
    });
});
