import { Inbox } from "../src/lib/Inbox";
import { IClientOptions, Client } from "../src/client/Client";
import { sendMail } from "./utils/send-mail";
import { MessageBodyType } from "../src/client/MessageBodyType";

const options: IClientOptions = {
  apiToken: process.env.API_TOKEN,
};

const client = new Client(options);
const inbox = new Inbox(client, "inbox");

describe("Integration - Inbox", () => {
  beforeAll(async () => {
    await sendMail({
      from: "test@test.com",
      to: "hello@1.com",
      subject: "test1",
      text: "message 1",
      html: "html1",
    });
    await sendMail({
      from: "test@test.com",
      to: "hello@1.com",
      subject: "test2",
      text: "message 2",
      html: "html2",
    });
  });

  afterAll(async () => {
    await inbox.deleteMessages();
  });

  it("can wait for messages based on condition", async () => {
    await inbox.waitForMessages((messages) => messages.length > 1);
    const messages = await inbox.getMessages();
    expect(messages).toHaveLength(2);
  });

  it("can get all messages", async () => {
    const messages = await inbox.getMessages();
    expect(messages).toHaveLength(2);
    expect(messages).toMatchObject([
      {
        from_email: "test@test.com",
        to_email: "hello@1.com",
        subject: "test2",
      },
      {
        from_email: "test@test.com",
        to_email: "hello@1.com",
        subject: "test1",
      },
    ]);
  });

  it("can get all messages based on filter", async () => {
    const messages = await inbox.getMessages((message) => message.subject === "test2");
    expect(messages).toHaveLength(1);
  });

  it("can get message text", async () => {
    const messages = await inbox.getMessages((message) => message.subject === "test1");
    expect(messages).toHaveLength(1);
    const id = messages[0].id;
    const text = await client.getMessageBody(inbox.ID, id, MessageBodyType.txt);
    expect(text).toEqual("message 1");
  });

  it("can get message html", async () => {
    const messages = await inbox.getMessages((message) => message.subject === "test2");
    expect(messages).toHaveLength(1);
    const id = messages[0].id;
    const html = await client.getMessageBody(inbox.ID, id, MessageBodyType.html);
    expect(html).toEqual("html2");
  });

  it("can delete all messages", async () => {
    await inbox.deleteMessages();
    await inbox.waitForMessages((messages) => messages.length === 0);
    const messages = await inbox.getMessages();
    expect(messages).toHaveLength(0);
  });
});
