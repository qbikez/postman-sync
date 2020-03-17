import got from "got";

export class PostmanApi {
  private baseUrl: string = "https://api.getpostman.com";
  constructor(private apiKey: string) {}

  public async getCollections() {
    const response = await got.get({
      url: `${this.baseUrl}/collections`,
      method: "GET",
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
      method: "GET",
      headers: {
        "X-Api-Key": this.apiKey
      }
    });

    const { collection } = JSON.parse(response.body.toString()) as { collection: Collection };

    return collection;
  }
}

export interface CollectionOverview {
  id: string;
  name: string;
  owner: string;
  uid: string;
}

export interface Collection {
  info: {
    _postman_id: "5089ba27-95b5-44b6-bc3a-faaffc4bdb64";
    name: "PaySync";
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
  };
  item: [
    {
      name: "tokens";
      item: [
        {
          name: "GET tokens";
          _postman_id: "27604476-a717-49bb-948d-04203c94b2e6";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "GET";
            header: [];
            url: {
              raw: "{{paysync_url}}/sites/{{siteId}}/bookings/{{bookRef}}/tokens?code={{paysync_apikey}}";
              host: ["{{paysync_url}}"];
              path: [
                "sites",
                "{{siteId}}",
                "bookings",
                "{{bookRef}}",
                "tokens"
              ];
              query: [
                {
                  key: "code";
                  value: "{{paysync_apikey}}";
                }
              ];
            };
          };
          response: [];
        },
        {
          name: "POST token";
          _postman_id: "952cb326-0609-4432-8f63-727f8b6169f0";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "POST";
            header: [
              {
                key: "Content-Type";
                name: "Content-Type";
                value: "application/json";
                type: "text";
              }
            ];
            body: {
              mode: "raw";
              raw: '{\n\t"token": "postman-{{$guid}}",\n\t"tokenSource": "SecureTrading"\n}';
              options: {
                raw: {
                  language: "json";
                };
              };
            };
            url: {
              raw: "{{paysync_url}}/sites/{{siteId}}/bookings/{{bookRef}}/{{roomPickId}}/tokens?code=1790ae5d68ab4664a14c484ff27c04f9";
              host: ["{{paysync_url}}"];
              path: [
                "sites",
                "{{siteId}}",
                "bookings",
                "{{bookRef}}",
                "{{roomPickId}}",
                "tokens"
              ];
              query: [
                {
                  key: "code";
                  value: "1790ae5d68ab4664a14c484ff27c04f9";
                }
              ];
            };
          };
          response: [];
        },
        {
          name: "POST transaction event";
          _postman_id: "7c6554c2-09b5-494e-851e-1ba283805ab3";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "POST";
            header: [
              {
                key: "Content-Type";
                name: "Content-Type";
                type: "text";
                value: "application/json";
              }
            ];
            body: {
              mode: "raw";
              raw: '[{\r\n  "id": "2287bb89-f704-4abf-b3ae-d8fe6cd4585c",\r\n  "subject": "pay/transaction/ST1-3b88c79d-b844-4c40-902f-cfabcc2cf3e8__U1QxLTNiODhjNzlkLWI4NDQtNGM0MC05MDJmLWNmYWJjYzJjZjNlOA",\r\n  "data": {\r\n    "Details": {\r\n      "transactionId": "ST1-3b88c79d-b844-4c40-902f-cfabcc2cf3e8__U1QxLTNiODhjNzlkLWI4NDQtNGM0MC05MDJmLWNmYWJjYzJjZjNlOA",\r\n      "previousState": "started",\r\n      "nextState": "payment taken",\r\n      "action": "payment",\r\n      "result": {\r\n        "transaction": {\r\n          "locked": false,\r\n          "transactionId": "ST1-3b88c79d-b844-4c40-902f-cfabcc2cf3e8__U1QxLTNiODhjNzlkLWI4NDQtNGM0MC05MDJmLWNmYWJjYzJjZjNlOA",\r\n          "active": true,\r\n          "operations": [\r\n            {\r\n              "op": "start",\r\n              "at": 1583232224794,\r\n              "outcome": "success"\r\n            },\r\n            {\r\n              "op": "payment",\r\n              "at": 1583232473710,\r\n              "outcome": "success"\r\n            }\r\n          ],\r\n          "nextActions": [],\r\n          "state": "payment taken",\r\n          "providerName": "SecureTrading",\r\n          "token": "3-9-5432832",\r\n          "configCode": "ST1",\r\n          "metadata": {\r\n            "PaySync": "{\\r\\n    \\"bookRef\\": \\"CONF000240\\",\\r\\n    \\"roomPickId\\": 1,\\r\\n    \\"siteId\\": \\"LAGERMAN\\",\\r\\n    \\"taxBreakdown\\": {\\r\\n        \\"VAT_23\\": 123.0\\r\\n    }\\r\\n}"\r\n          },\r\n          "attributes": {\r\n            "requestreference": "W3-y2b7mvbk",\r\n            "timestamp": "2020-03-03 10:47:53",\r\n            "transactionreference": "3-9-5432832"\r\n          }\r\n        },\r\n        "operation": {\r\n          "op": "payment",\r\n          "at": 1583232473710,\r\n          "outcome": "success"\r\n        }\r\n      },\r\n      "payload": {\r\n        "PaySync": "{\\r\\n    \\"bookRef\\": \\"{{bookRef}}\\",\\r\\n    \\"roomPickId\\": {{roomPickId}},\\r\\n    \\"siteId\\": \\"{{siteId}}\\",\\r\\n    \\"taxBreakdown\\": {\\r\\n        \\"VAT_23\\": 123.0\\r\\n    }\\r\\n}"\r\n      }\r\n    },\r\n    "EventId": "2287bb89-f704-4abf-b3ae-d8fe6cd4585c",\r\n    "EventType": "PaymentStateEvent",\r\n    "SenderSystem": "pay",\r\n    "Timestamp": "2020-03-03T10:47:53.71Z",\r\n    "Version": "1.0"\r\n  },\r\n  "eventType": "PaymentStateEvent",\r\n  "eventTime": "2020-03-03T10:47:53.71Z",\r\n  "dataVersion": "1.0",\r\n  "metadataVersion": "1",\r\n  "topic": "/subscriptions/e254f09e-7285-4329-be2a-a25588a65b44/resourceGroups/pay-ci-rg/providers/Microsoft.EventGrid/domains/pay-ci-egd/topics/pay"\r\n}]';
              options: {
                raw: {
                  language: "json";
                };
              };
            };
            url: {
              raw: "{{paysync_url}}/gridEvents/paymentState";
              host: ["{{paysync_url}}"];
              path: ["gridEvents", "paymentState"];
            };
          };
          response: [];
        },
        {
          name: "verify webhook";
          _postman_id: "2f464de7-e199-4b52-846d-d6d161fc64e8";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "POST";
            header: [
              {
                key: "Content-Type";
                name: "Content-Type";
                type: "text";
                value: "application/json";
              }
            ];
            body: {
              mode: "raw";
              raw: '[{\r\n  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",\r\n  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",\r\n  "subject": "",\r\n  "data": {\r\n    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",\r\n    "validationUrl": "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/estest/validate?id=512d38b6-c7b8-40c8-89fe-f46f9e9622b6&t=2018-04-26T20:30:54.4538837Z&apiVersion=2018-05-01-preview&token=1A1A1A1A"\r\n  },\r\n  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",\r\n  "eventTime": "2018-01-25T22:12:19.4556811Z",\r\n  "metadataVersion": "1",\r\n  "dataVersion": "1"\r\n}]';
              options: {
                raw: {
                  language: "json";
                };
              };
            };
            url: {
              raw: "{{paysync_url}}/gridEvents/paymentState";
              host: ["{{paysync_url}}"];
              path: ["gridEvents", "paymentState"];
            };
          };
          response: [];
        },
        {
          name: "health";
          _postman_id: "47326d3d-fb8d-4109-bb5f-ac92a7437548";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "GET";
            header: [];
            url: {
              raw: "{{paysync_url}}/status/health";
              host: ["{{paysync_url}}"];
              path: ["status", "health"];
            };
          };
          response: [];
        },
        {
          name: "db check";
          _postman_id: "f4ffe6c7-5255-46bb-87f5-5bbdc9866f81";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "GET";
            header: [];
            url: {
              raw: "{{paysync_url}}/status/db/{{siteId}}";
              host: ["{{paysync_url}}"];
              path: ["status", "db", "{{siteId}}"];
            };
          };
          response: [];
        }
      ];
      _postman_id: "272bbd01-6c46-4a38-9cc7-f4e39712c061";
      auth: {
        type: "apikey";
        apikey: [
          {
            key: "value";
            value: "{{paysync_apikey}}";
            type: "string";
          },
          {
            key: "key";
            value: "code";
            type: "string";
          },
          {
            key: "in";
            value: "query";
            type: "string";
          }
        ];
      };
      event: [
        {
          listen: "prerequest";
          script: {
            id: "e8090df2-7440-4e56-b854-9b512a2b0997";
            type: "text/javascript";
            exec: [""];
          };
        },
        {
          listen: "test";
          script: {
            id: "8c90d42d-d948-42d8-bc18-9a9735162b40";
            type: "text/javascript";
            exec: [""];
          };
        }
      ];
    },
    {
      name: "functions";
      item: [
        {
          name: "[func] HandlePaymentState";
          event: [
            {
              listen: "test";
              script: {
                id: "40c9bc8e-4e1f-4630-a75f-15e4156008e5";
                exec: [
                  'pm.test("Status code is 202", function () {',
                  "    pm.response.to.have.status(202);",
                  "});"
                ];
                type: "text/javascript";
              };
            }
          ];
          _postman_id: "e24db4a0-2bd3-486e-85e0-f0143c217db1";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "POST";
            header: [
              {
                key: "aeg-event-type";
                type: "text";
                value: "Notification";
              },
              {
                key: "con";
                type: "text";
                value: "";
                disabled: true;
              },
              {
                key: "x-functions-key";
                type: "text";
                value: "asGmO6TCW/t42krL9CljNod3uG9aji4mJsQ7==";
                disabled: true;
              }
            ];
            body: {
              mode: "raw";
              raw: '[{\r\n  "id": "dfbd90c3-6564-4893-9dcf-3b092dd6002d",\r\n  "subject": "pay/transaction/SIM1-c6501457-ad3a-494b-8c25-4cef3a7d3fb9__U0lNMS1jNjUwMTQ1Ny1hZDNhLTQ5NGItOGMyNS00Y2VmM2E3ZDNmYjk",\r\n  "data": {\r\n    "Details": {\r\n      "transactionId": "SIM1-c6501457-ad3a-494b-8c25-4cef3a7d3fb9__U0lNMS1jNjUwMTQ1Ny1hZDNhLTQ5NGItOGMyNS00Y2VmM2E3ZDNmYjk",\r\n      "previousState": "started",\r\n      "nextState": "payment taken",\r\n      "action": "payment",\r\n      "result": {\r\n        "transaction": {\r\n          "locked": false,\r\n          "transactionId": "SIM1-c6501457-ad3a-494b-8c25-4cef3a7d3fb9__U0lNMS1jNjUwMTQ1Ny1hZDNhLTQ5NGItOGMyNS00Y2VmM2E3ZDNmYjk",\r\n          "active": true,\r\n          "operations": [\r\n            {\r\n              "op": "start",\r\n              "at": 1583396328330,\r\n              "outcome": "success"\r\n            },\r\n            {\r\n              "op": "payment",\r\n              "at": 1583396405940,\r\n              "outcome": "success"\r\n            }\r\n          ],\r\n          "nextActions": [],\r\n          "state": "payment taken",\r\n          "providerName": "Test Simulator",\r\n          "token": "rand",\r\n          "configCode": "SIM1",\r\n          "metadata": {\r\n            "PaySync": "{\\"BookRef\\":\\"{{bookRef}}\\",\\"RoomPickId\\":1,\\"SiteId\\":\\"{{siteId}}\\",\\"TaxBreakdown\\":{\\"VAT_23\\":123.0}}"\r\n          },\r\n          "attributes": {}\r\n        },\r\n        "operation": {\r\n          "op": "payment",\r\n          "at": 1583396405940,\r\n          "outcome": "success"\r\n        }\r\n      },\r\n      "payload": {\r\n        "PaySync": "{\\"BookRef\\":\\"{{bookRef}}\\",\\"RoomPickId\\":1,\\"SiteId\\":\\"{{siteId}}\\",\\"TaxBreakdown\\":{\\"VAT_23\\":123.0}}"\r\n      }\r\n    },\r\n    "EventId": "dfbd90c3-6564-4893-9dcf-3b092dd6002d",\r\n    "EventType": "PaymentStateEvent",\r\n    "SenderSystem": "pay",\r\n    "Timestamp": "2020-03-05T08:20:05.94Z",\r\n    "Version": "1.0"\r\n  },\r\n  "eventType": "PaymentStateEvent",\r\n  "eventTime": "2020-03-05T08:20:05.94Z",\r\n  "dataVersion": "1.0",\r\n  "metadataVersion": "1",\r\n  "topic": "/subscriptions/e254f09e-7285-4329-be2a-a25588a65b44/resourceGroups/pay-ci-rg/providers/Microsoft.EventGrid/domains/pay-ci-egd/topics/pay"\r\n}]';
              options: {
                raw: {
                  language: "json";
                };
              };
            };
            url: {
              raw: "{{paysync_fa_url}}/runtime/webhooks/eventgrid?functionName=HandlePaymentState";
              host: ["{{paysync_fa_url}}"];
              path: ["runtime", "webhooks", "eventgrid"];
              query: [
                {
                  key: "functionName";
                  value: "HandlePaymentState";
                }
              ];
            };
          };
          response: [];
        },
        {
          name: "[func] Get Metadata";
          _postman_id: "543049d1-be29-40e0-976e-bc33a6acd225";
          protocolProfileBehavior: {
            disableBodyPruning: true;
          };
          request: {
            method: "POST";
            header: [
              {
                key: "Content-Type";
                name: "Content-Type";
                value: "application/json";
                type: "text";
              }
            ];
            body: {
              mode: "raw";
              raw: '{\n\t"bookRef": "{{bookRef}}",\n\t"roomPickId": {{roomPickId}},\n\t"siteId": "{{siteId}}",\n\t"taxBreakdown": {\n\t\t"VAT_23": 123.0\n\t}\n}';
              options: {
                raw: {
                  language: "json";
                };
              };
            };
            url: {
              raw: "{{paysync_fa_url}}/api/MetaData/";
              host: ["{{paysync_fa_url}}"];
              path: ["api", "MetaData", ""];
            };
          };
          response: [];
        }
      ];
      _postman_id: "a592a070-5860-47c9-9817-474b1fe1affc";
    }
  ];
  auth: {
    type: "apikey";
    apikey: [
      {
        key: "value";
        value: "{{paysync_fa_key}}";
        type: "string";
      },
      {
        key: "key";
        value: "x-functions-key";
        type: "string";
      }
    ];
  };
  event: [
    {
      listen: "prerequest";
      script: {
        id: "527aa170-ec89-4d7c-b3fd-1ca1624e3276";
        type: "text/javascript";
        exec: [""];
      };
    },
    {
      listen: "test";
      script: {
        id: "dd717259-e2c2-4e0e-8a44-5514e6d27fbe";
        type: "text/javascript";
        exec: [""];
      };
    }
  ];
  variable: [
    {
      id: "cca12b51-3395-4938-9b08-d33528cf7d73";
      key: "paysync_fa_key";
      value: "UldjYWZvNnI0JSp5RjNkZHNGUkk0S0dybiE5";
      type: "string";
    },
    {
      id: "996ccc46-f42a-4615-a490-d7591af74c38";
      key: "paysync_url";
      value: "http://localhost:5000";
      type: "string";
    },
    {
      id: "f13d1ea1-718d-479c-b8d4-bcfed4cc105a";
      key: "siteId";
      value: "LAGERMAN";
      type: "string";
    },
    {
      id: "b32ca2ce-bfbd-4047-b849-33e9ec3455c9";
      key: "bookRef";
      value: "4325BK0925";
      type: "string";
    },
    {
      id: "b9635b06-8e4c-4ba4-a49d-edfe45630dca";
      key: "roomPickId";
      value: "1";
      type: "string";
    }
  ];
}
