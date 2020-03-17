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
    async getCollections() {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/collections`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { collections } = JSON.parse(response.body.toString());
        return collections;
    }
    async getCollection(uuid) {
        const response = await got_1.default.get({
            url: `${this.baseUrl}/collections/${uuid}`,
            headers: {
                "X-Api-Key": this.apiKey
            }
        });
        const { collection } = JSON.parse(response.body.toString());
        return collection;
    }
    async createCollection(collection) {
        if (!collection.info.schema) {
            collection.info.schema = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
        }
        const response = await got_1.default.post({
            url: `${this.baseUrl}/collections/`,
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
}
exports.PostmanApi = PostmanApi;
