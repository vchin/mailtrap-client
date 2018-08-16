import test from "ava";
import { assert } from "chai";
import { Client } from "./Client";
import { ClientOptions } from "./ClientOptions";
import { Inbox } from "./IInbox";
import { Message } from "./IMessage";
import { MessageBodyType } from "./MessageBodyType";
import { inboxes, messages } from "./mock-server";

const options = new ClientOptions("apiToken");
options.endpoint = "http://localhost:3000";

test("init client with no apiToken or jwtToken throws error", (t) => {
  assert.throws(() => new Client(new ClientOptions("", "")));
  t.pass();
});

test("can get inboxes", async (t) => {
  const client = new Client(options);
  const res = await client.getInboxes();
  assert.deepEqual(res.map((r) => r.inbox), inboxes.map((inbox: object) => new Inbox(inbox)));
  t.pass();
});

test("can get inbox", async (t) => {
  const client = new Client(options);
  const res = await client.getInbox(3);
  assert.deepEqual(res.inbox, new Inbox(inboxes[0]));
  t.pass();
});

test("can get inbox messages", async (t) => {
  const client = new Client(options);
  const res = await client.getMessages(3);
  assert.deepEqual(res.map((r) => r.message), messages.filter((m) => m.inbox_id === 3).map((m) => new Message(m)));
  t.pass();
});

test("can get message html body", async (t) => {
  const client = new Client(options);
  const res = await client.getMessageBody(3, 1, MessageBodyType.html);
  assert.strictEqual(res, "html");
  t.pass();
});

test("can get message txt body", async (t) => {
  const client = new Client(options);
  const res = await client.getMessageBody(3, 1, MessageBodyType.txt);
  assert.strictEqual(res, "txt");
  t.pass();
});

test("can get message raw body", async (t) => {
  const client = new Client(options);
  const res = await client.getMessageBody(3, 1, MessageBodyType.raw);
  assert.strictEqual(res, "raw");
  t.pass();
});

test("can get message eml body", async (t) => {
  const client = new Client(options);
  const res = await client.getMessageBody(3, 1, MessageBodyType.eml);
  assert.strictEqual(res, "eml");
  t.pass();
});

test("can delete message", async (t) => {
  const client = new Client(options);
  const res = await client.getMessages(3);
  assert.strictEqual(res.length, 1);
  const msg = res[0];
  const res2 = await msg.delete();
  assert.strictEqual(res2, "ok");
  t.pass();
});
