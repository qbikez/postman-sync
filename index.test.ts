import { main, PostmanSync } from "./index";
import got from "got";
import { PostmanApi } from "./postman-api/collections";
import { v4 as uuid } from "uuid";

const apiKey = process.env.POSTMAN_API_KEY || '';

describe("postman sync", () => {
  it("should store api key", () => {
    const sync = new PostmanSync("test-config.json");
    const key = `test-${uuid()}`;
    sync.setApiKey(key);

    const retrieved = sync.getApiKey();
    expect(retrieved).toBe(key);
  });
});

describe("postman API", () => {
  const postmanApi = new PostmanApi(apiKey);

  describe("when calling GET collections", () => {
    it("should get all collections", async () => {
      const collections = await postmanApi.getCollections();
      expect(collections.length).toBeGreaterThan(0);
    });
  });
});

describe("test fixture", () => {
  it("should work", () => {
    const exitCode = main(["a"]);
    expect(exitCode).toBe(0);
  });
});
