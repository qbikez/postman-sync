"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collections_1 = require("./collections");
const uuid_1 = __importDefault(require("uuid"));
const apiKey = process.env.POSTMAN_API_KEY || "";
describe("postman API", () => {
    const postmanApi = new collections_1.PostmanApi(apiKey);
    describe("when calling GET collections", () => {
        it("should get all collections", async () => {
            const collections = await postmanApi.getCollections();
            expect(collections.length).toBeGreaterThan(0);
        });
        it("should get a single collection", async () => {
            const collections = await postmanApi.getCollections();
            const uuid = collections[0].uid;
            const collection = await postmanApi.getCollection(uuid);
            expect(collection).not.toBeNull();
            expect(collection.info._postman_id).not.toBeNull();
        });
    });
    describe("create collection", () => {
        const name = `test-collection-${uuid_1.default.v4()}`;
        let id;
        it("should work", async () => {
            const resp = await postmanApi.createCollection({
                info: {
                    name
                },
                item: []
            });
            id = resp.id;
            expect(resp.name).toBe(name);
        });
        afterAll(async () => {
            if (id) {
                await postmanApi.deleteCollection(id);
            }
        });
    });
});
