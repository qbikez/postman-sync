import { PostmanApi } from "./postman-api";
import uuid from "uuid";

const apiKey = process.env.POSTMAN_API_KEY || "";

describe("postman API", () => {
  const postmanApi = new PostmanApi(apiKey);

  describe("when calling GET collections", () => {
    it("should get all collections", async () => {
      const collections = await postmanApi.getCollections();
      expect(collections.length).toBeGreaterThan(0);
    });

    it("no collections in non-existing workspace", async () => {
      const collections = await postmanApi.getCollections('dummy-workspace');
      expect(collections.length).toBe(0);
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
    const name = `test-collection-${uuid.v4()}`;
    let id: string;
    it("without workspace", async () => {
      const resp = await postmanApi.createCollection({
        info: {
          name
        },
        item: []
      });

      id = resp.id;
      expect(resp.name).toBe(name);
    });

    it("with workspace", async () => {
      const resp = await postmanApi.createCollection({
        info: {
          name
        },
        item: []
      }, 'test');

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
