import moment = require("moment");
import { Client } from "./Client";
import { Inbox } from "./Inbox";
import { Message } from "./Message";
import { MessageClient } from "./MessageClient";

export class InboxClient {
  public inbox: Inbox;
  private client: Client;
  private timeout: number;
  private pollingInterval: number;

  constructor(inbox: Inbox, client: Client) {
    this.inbox = inbox;
    this.client = client;
    this.timeout = client.options.defaultTimeout;
    this.pollingInterval = client.options.defaultPollingInterval;
  }

  public getMessages(messageFilter?: (message: Message) => boolean): Promise<MessageClient[]> {
    return this.client.getMessages(this.inbox.id, messageFilter);
  }

  public waitForMessages(
    expectedCount: number,
    timeout?: number,
    messageFilter?: (message: Message) => boolean,
    startTime?: moment.Moment): Promise<MessageClient[]> {
    if (startTime === null) {
      startTime = moment();
    }
    return this.getMessages(messageFilter)
      .then((messages) => {
        if (messages.length >= expectedCount) {
          return messages;
        }

        const duration = moment.duration(moment().diff(startTime));
        const timeRemaining = timeout - duration.asMilliseconds();

        if (timeRemaining > 0) {
          return new Promise((resolve) => setTimeout(resolve, this.pollingInterval))
            .then(() =>
              this.waitForMessages(expectedCount, timeout, messageFilter, startTime));
        }

        return [];
      });
  }

  public deleteMessage(messageID: number) {
    if (messageID) {
      return this.client.deleteMessage(this.inbox.id, messageID);
    }
    return Promise.resolve();
  }

  public deleteMessages(messageFilter?: (message: Message) => boolean): Promise<any> {
    return this.getMessages(messageFilter)
      .then((messages) => Promise.all(messages.map((m) => m.delete())));
  }
}
