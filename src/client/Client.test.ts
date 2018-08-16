import { inboxes, messages, mock } from "../__MOCKS__/MockMailtrap";
import { Client, IClientOptions } from "./Client";
import { MessageBodyType } from "./MessageBodyType";

const options: IClientOptions = {
  credentials: {
    apiToken: "api",
  },
  endpoint: "http://localhost:3000",
};

describe("Client", () => {
  afterAll(() => {
    mock.close();
  });

  it("init client with no apiToken or jwtToken throws error", async () => {
    expect(() => new Client({
      credentials: {},
    })).toThrow();
  });

  it("can get inboxes", async () => {
    const client = new Client(options);
    const res = await client.getInboxes();
    expect(res).toMatchObject(inboxes);
  });

  it("can get inbox", async () => {
    const client = new Client(options);
    const res = await client.getInbox(3);
    expect(res).toMatchObject(inboxes[0]);
  });

  it("can get inbox messages", async () => {
    const client = new Client(options);
    const res = await client.getMessages(3);
    expect(res).toMatchObject(messages.filter((m) => m.inbox_id === 3));
  });

  it("can get message html body", async () => {
    const client = new Client(options);
    const res = await client.getMessageBody(3, 1, MessageBodyType.html);
    expect(res).toEqual("html");
  });

  it("can get message txt body", async () => {
    const client = new Client(options);
    const res = await client.getMessageBody(3, 1, MessageBodyType.txt);
    expect(res).toEqual("txt");
  });

  it("can get message raw body", async () => {
    const client = new Client(options);
    const res = await client.getMessageBody(3, 1, MessageBodyType.raw);
    expect(res).toEqual("raw");
  });

  it("can get message eml body", async () => {
    const client = new Client(options);
    const res = await client.getMessageBody(3, 1, MessageBodyType.eml);
    expect(res).toEqual("eml");
  });

  it("can delete message", async () => {
    const client = new Client(options);
    const res = await client.getMessages(3);
    expect(res.length).toEqual(1);
    const msg = res[0];
    const res2 = await client.deleteMessage(msg.inbox_id, msg.id);
    expect(res2).toEqual("ok");
  });
});
