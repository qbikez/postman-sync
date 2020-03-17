import { PostmanSync } from "./postman-sync";
import { v4 as uuid } from "uuid";

describe("postman sync", () => {
    it("should store api key", () => {
      const sync = new PostmanSync("test-config.json");
      const key = `test-${uuid()}`;
      sync.setApiKey(key);
  
      const retrieved = sync.getApiKey();
      expect(retrieved).toBe(key);
    });
  });