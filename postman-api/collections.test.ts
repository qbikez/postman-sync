import { PostmanApi } from "./collections";

const apiKey = process.env.POSTMAN_API_KEY || "";

describe("postman API", () => {
    const postmanApi = new PostmanApi(apiKey);
  
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
  });