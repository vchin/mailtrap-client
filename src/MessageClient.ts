import { Client } from "./Client";
import { Message } from "./IMessage";
import { MessageBodyType } from "./MessageBodyType";

export class MessageClient {
  public message: Message;
  private client: Client;

  constructor(message: Message, client: Client) {
    this.message = message;
    this.client = client;
  }

  public delete() {
    return this.client.deleteMessage(this.message.inbox_id, this.message.id);
  }

  public getBody(type: MessageBodyType) {
    return this.client.getMessageBody(this.message.inbox_id, this.message.id, type);
  }
}
