import { PostmanSync } from "./postman-sync";
import { v4 as uuid } from "uuid";
import { Collection } from "./postman-api/collections";
import fs from "fs";

const apiKey = process.env.POSTMAN_API_KEY || "";
const baseDir = "./.test-data";
const testDir = `${baseDir}/${uuid()}`;
describe("postman sync", () => {
  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir, { recursive: true });
    }
  });

  fit("should store api key", () => {
    const sync = new PostmanSync(`${testDir}/test-config.json`);
    const key = `test-${uuid()}`;
    sync.setApiKey(key);

    const retrieved = sync.getApiKey();
    expect(retrieved).toBe(key);
  });

  it("push", async () => {
    const name = `test-collection-${uuid()}`;
    const collection: Collection = {
      info: {
        name
      },
      item: []
    };
    fs.writeFileSync(
      `${testDir}/${name}.postman_collection.json`,
      JSON.stringify(collection),
      "utf-8"
    );

    const sync = new PostmanSync({ apiKey });

    await sync.push(testDir);
  });

  it("pull", async () => {
    const sync = new PostmanSync({ apiKey });
    await sync.pull(testDir);
  });
});
