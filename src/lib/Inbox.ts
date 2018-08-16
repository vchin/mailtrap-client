import { Client } from "../client/Client";
import { IInbox } from "../client/IInbox";
import { IMessage } from "../client/IMessage";

export class Inbox {
  private self: IInbox;
  constructor(private readonly client: Client, private readonly name: string) {}

  public async waitForMessages(
    condition: (messages: IMessage[]) => boolean,
    messageFilter?: (message: IMessage) => boolean): Promise<void> {
    await this.init();
    await this.client.waitForMessages(this.self.id, condition, messageFilter);
  }

  public async getMessages(messageFilter?: (message: IMessage) => boolean): Promise<IMessage[]> {
    await this.init();
    const messages = await this.client.getMessages(this.self.id, messageFilter);
    return messages;
  }

  public async deleteMessages(messageFilter?: (message: IMessage) => boolean): Promise<void> {
    await this.init();
    await this.client.deleteMessages(this.self.id, messageFilter);
  }

  private async init(): Promise<void> {
    if (!this.self) {
      const inboxes = await this.client.getInboxes((inbox) => inbox.name === this.name);
      this.self = inboxes[0];
    }
  }
}
