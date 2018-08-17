import * as moment from "moment";
import * as request from "superagent";
import * as util from "util";
import { IInbox } from "./IInbox";
import { IMessage } from "./IMessage";
import { MessageBodyType } from "./MessageBodyType";

export interface IClientOptions {
  apiToken: string;
  pollingInterval?: number;
  waitTimeout?: number;
  endpoint?: string;
}

export class Client {
  private readonly apiToken: string;
  private readonly pollingInterval: number;
  private readonly waitTimeout: number;
  private readonly endpoint: string;
  constructor(options: IClientOptions) {
    this.pollingInterval = options.pollingInterval || 1000;
    this.waitTimeout = options.waitTimeout || 60000;
    this.endpoint = options.endpoint || "https://mailtrap.io/api/v1";
    this.apiToken = options.apiToken;
  }

  public getInbox(inboxID: number): Promise<IInbox> {
    return this.getJSON(`/inboxes/${inboxID}`);
  }

  public getInboxes(inboxFilter?: (inbox: IInbox) => boolean): Promise<IInbox[]> {
    return this.getJSON("/inboxes")
      .then((inboxes) => {
        if (inboxFilter) {
          return inboxes.filter(inboxFilter);
        }
        return inboxes;
      });
  }

  public getMessages(inboxID: number, messageFilter?: (message: IMessage) => boolean): Promise<IMessage[]> {
    return this.getJSON(`/inboxes/${inboxID}/messages`)
      .then((messages) => {
        if (messageFilter) {
          return messages.filter(messageFilter);
        }
        return messages;
      });
  }

  public deleteMessage(inboxID: number, messageID: number) {
    return this.delete(`/inboxes/${inboxID}/messages/${messageID}`);
  }

  public deleteMessages(inboxID: number, messageFilter?: (message: IMessage) => boolean) {
    return this.getMessages(inboxID, messageFilter)
      .then((messages) => Promise.all(messages.map((message) => this.deleteMessage(inboxID, message.id))));
  }

  public getMessageBody(inboxID: number, messageID: number, bodyType: MessageBodyType) {
    return this.getText(`/inboxes/${inboxID}/messages/${messageID}/body.${bodyType.toString()}`);
  }

  public async waitForMessages(
    inboxID: number,
    condition: (messages: IMessage[]) => boolean,
    messageFilter?: (message: IMessage) => boolean, startTime?: moment.Moment): Promise<void> {
    if (!startTime) {
      startTime = moment();
    }
    const messages = await this.getMessages(inboxID, messageFilter);
    const conditionResult = await condition(messages);
    if (conditionResult) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, this.pollingInterval));
    if (this.isWaitTimeoutExceeded(startTime)) {
      throw new Error("Timed out waiting for messages");
    }
    return this.waitForMessages(inboxID, condition, messageFilter, startTime);
  }

  private async delete(path: string) {
    const res = await request.delete(`${this.endpoint}${path}`).set("Authorization", `Token token=${this.apiToken}`);
    return res.text;
  }

  private get(path: string) {
    return request(`${this.endpoint}${path}`).set("Authorization", `Token token=${this.apiToken}`);
  }

  private async getJSON(path: string): Promise<any> {
    const res = await this.get(path);
    return res.body;
  }

  private async getText(path: string): Promise<string> {
    const res = await this.get(path);
    return res.text;
  }

  private isWaitTimeoutExceeded(startTime: moment.Moment): boolean {
    const duration = moment.duration(moment().diff(startTime));
    if (this.waitTimeout - duration.asMilliseconds() > 0) {
      return false;
    }
    return true;
  }
}
