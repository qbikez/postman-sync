"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
class PostmanApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.getpostman.com";
    }
    async getCollections(workspace) {
        if (!workspace)
            return this._getCollections();
        else {
            const workspaceOverview = (await this.getWorkspaces()).find(ws => ws.name === workspace);
            if (!workspaceOverview)
                return [];
            return await (await this.getWorkspace(workspaceOverview.id)).collections;
        }
    }
    async _getCollections() {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/collections/`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { collections } = JSON.parse(response.body.toString());
        return collections;
    }
    async getCollection(uid) {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/collections/${uid}`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { collection } = JSON.parse(response.body.toString());
        return collection;
    }
    async createCollection(collection, workspace) {
        if (workspace) {
            const wsInfo = await (await this.getWorkspaces()).find(ws => ws.name === workspace || ws.id === workspace);
            if (!wsInfo)
                throw new Error(`workspace ${workspace} not found.`);
            workspace = wsInfo === null || wsInfo === void 0 ? void 0 : wsInfo.id;
        }
        return this._createCollection(collection, workspace);
    }
    async _createCollection(collection, workspace) {
        if (!collection.info.schema) {
            collection.info.schema =
                "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
        }
        const response = await got_1.default.post({
            url: `${this.baseUrl}/collections/` + (workspace ? `?workspace=${workspace}` : ''),
            headers: {
                "X-Api-Key": this.apiKey
            },
            json: { collection }
        });
        const { collection: overview } = JSON.parse(response.body.toString());
        return overview;
    }
    async updateCollection(uuid, collection) {
        const response = await got_1.default.put({
            url: `${this.baseUrl}/collections/${uuid}`,
            headers: {
                "X-Api-Key": this.apiKey
            },
            json: { collection }
        });
        const { collection: overview } = JSON.parse(response.body.toString());
        return overview;
    }
    async deleteCollection(uuid) {
        const response = await got_1.default.delete({
            url: `${this.baseUrl}/collections/${uuid}`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { collection: overview } = JSON.parse(response.body.toString());
        return overview;
    }
    async getWorkspaces() {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/workspaces`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { workspaces } = JSON.parse(response.body.toString());
        return workspaces;
    }
    async getWorkspace(uid) {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/workspaces/${uid}`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { workspace } = JSON.parse(response.body.toString());
        return workspace;
    }
}
exports.PostmanApi = PostmanApi;
