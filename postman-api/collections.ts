import got from "got";

export class PostmanApi {
  private baseUrl: string = "https://api.getpostman.com";
  constructor(private apiKey: string) {}

  public async getCollections() {
    const response = await got.get({
      url: `${this.baseUrl}/collections`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collections } = JSON.parse(response.body.toString()) as {
      collections: CollectionOverview[];
    };

    return collections;
  }

  public async getCollection(uuid: string) {
    const response = await got.get({
      url: `${this.baseUrl}/collections/${uuid}`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collection } = JSON.parse(response.body.toString()) as {
      collection: Collection;
    };

    return collection;
  }

  public async createCollection(collection: Collection) {
    if (!collection.info.schema) {
      collection.info.schema = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    }
    const response = await got.post({
      url: `${this.baseUrl}/collections/`,
      headers: {
        "X-Api-Key": this.apiKey
      },
      json: { collection }
    });

    const { collection: overview } = JSON.parse(response.body.toString()) as {
      collection: CollectionOverview;
    };

    return overview;
  }

  public async updateCollection(uuid: string, collection: Collection) {
    const response = await got.put({
      url: `${this.baseUrl}/collections/${uuid}`,
      headers: {
        "X-Api-Key": this.apiKey
      },
      json: { collection }
    });

    const { collection: overview } = JSON.parse(response.body.toString()) as {
      collection: CollectionOverview;
    };

    return overview;
  }

  public async deleteCollection(uuid: string) {
    const response = await got.delete({
      url: `${this.baseUrl}/collections/${uuid}`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collection: overview } = JSON.parse(response.body.toString()) as {
      collection: CollectionOverview;
    };

    return overview;
  }
}

export interface CollectionOverview {
  id: string;
  name: string;
  owner: string;
  uid: string;
}

interface CollectionItem {
    name: string;
    _postman_id: string;
    protocolProfileBehavior: {
      disableBodyPruning: true;
    };
    request: {
      method: string;
      header: [];
      body: {
        mode: string;
        raw: string;
        options: {
          raw: {
            language: string;
          };
        };
      };
      url: {
        raw: string;
        host: string[];
        path: string[];
        query: [
          {
            key: string;
            value: string;
          }
        ];
      };
    };
    response: [];
}

export interface Collection {
  info: {
    _postman_id?: string;
    name: string;
    schema?: string;
  };
  item: Array<
    Collection | CollectionItem
  >;
  auth?: {
    type: string;
    apikey: [
      {
        key: string;
        value: string;
        type: string;
      }
    ];
  };
  event?: [
    {
      listen: string;
      script: {
        id: string;
        type: string;
        exec: string[];
      };
    }
  ];
  variable?: [
    {
      id: string;
      key: string;
      value: string;
      type: string;
    }
  ];
}
