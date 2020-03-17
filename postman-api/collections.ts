import got from "got";

export class PostmanApi {
    constructor(private apiKey: string) {
    }

    public async getCollections() {
        const response = await got.get({
            url: "https://api.getpostman.com/collections",
            method: 'GET',
            headers: {
              "X-Api-Key": this.apiKey
            },
          });
          
          const { collections } = JSON.parse(response.body.toString()) as { collections: Collection[] };

          return collections;
    }
}

export interface Collection {
    id: string;
    name: string;
    owner: string;
    uid: string;
}