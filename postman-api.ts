import got from "got";

export class PostmanApi {
  private baseUrl: string = "https://api.getpostman.com";
  constructor(private apiKey: string) {}

  public async getCollections(workspace?: string): Promise<CollectionOverview[]> {
    if (!workspace) return this._getCollections();
    else {
      const workspaceOverview = (await this.getWorkspaces()).find(ws => ws.name === workspace);
      if (!workspaceOverview) return [];
      return await (await this.getWorkspace(workspaceOverview.id)).collections;
    }
  }
  private async _getCollections() {
    const response = await got.get({
      url: `${this.baseUrl}/collections/`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collections } = JSON.parse(response.body.toString()) as {
      collections: CollectionOverview[];
    };

    return collections;
  }
  

  public async getCollection(uid: string) {
    const response = await got.get({
      url: `${this.baseUrl}/collections/${uid}`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collection } = JSON.parse(response.body.toString()) as {
      collection: Collection;
    };

    return collection;
  }

  public async createCollection(collection: Collection, workspace?: string) {
    if (workspace) {
      const wsInfo = await (await this.getWorkspaces()).find(ws => ws.name === workspace || ws.id === workspace);
      if (!wsInfo) throw new Error(`workspace ${workspace} not found.`);
      workspace = wsInfo?.id;
    }
    return this._createCollection(collection, workspace);
  }

  private async _createCollection(collection: Collection, workspace?: string) {
    if (!collection.info.schema) {
      collection.info.schema =
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
    }
    const response = await got.post({
      url: `${this.baseUrl}/collections/` + (workspace ? `?workspace=${workspace}` : ''),
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

  public async getWorkspaces() {
    const response = await got.get({
      url: `${this.baseUrl}/workspaces`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { workspaces } = JSON.parse(response.body.toString()) as {
      workspaces: WorkspaceOverview[];
    };

    return workspaces;
  }

  public async getWorkspace(uid: string): Promise<Workspace> {
    const response = await got.get({
      url: `${this.baseUrl}/workspaces/${uid}`,
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { workspace } = JSON.parse(response.body.toString()) as {
      workspace: Workspace;
    };

    return workspace;
  }
}

export interface Workspace {
  id: string;
  name: string;
  type: string;
  description: string;
  collections: CollectionOverview[],
  environments: Array<
    {
      id: string;
      name: string;
      uid: string;
    }
  >;
}

export interface WorkspaceOverview {
  id: string;
  name: string;
  type: string;
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
  item: Array<Collection | CollectionItem>;
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
