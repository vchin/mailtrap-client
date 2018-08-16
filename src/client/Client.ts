import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as moment from "moment";
import * as util from "util";
import { IInbox } from "./IInbox";
import { IMessage } from "./IMessage";
import { MessageBodyType } from "./MessageBodyType";

export interface ICredentials {
  apiToken?: string;
  jwt?: string;
}

export interface IClientOptions {
  credentials: ICredentials;
  pollingInterval?: number;
  waitTimeout?: number;
  endpoint?: string;
}

export class Client {
  private readonly client: AxiosInstance;
  private readonly pollingInterval: number;
  private readonly waitTimeout: number;
  constructor(private readonly options: IClientOptions) {
    if (!options.credentials.apiToken && !options.credentials.jwt) {
      throw new Error("Must initialize Client with credentials");
    }
    this.pollingInterval = options.pollingInterval || 1000;
    this.waitTimeout = options.waitTimeout || 60000;
    this.client = axios.create({
      baseURL: options.endpoint || "https://mailtrap.io/api/v1",
      headers: {
        Authorization:
          options.credentials.apiToken ?
          `Token token=${options.credentials.apiToken}`
          :
          `Bearer ${options.credentials.jwt}`,
      },
    });
  }

  public get(url: string) {
    return this.client.get(url).then(this.formatResponse);
  }

  public getInbox(inboxID: number): Promise<IInbox> {
    return this.get(`/inboxes/${inboxID}`);
  }

  public getInboxes(inboxFilter?: (inbox: IInbox) => boolean): Promise<IInbox[]> {
    return this.get("/inboxes")
      .then((inboxes) => {
        if (inboxFilter) {
          return inboxes.filter(inboxFilter);
        }
        return inboxes;
      });
  }

  public getMessages(inboxID: number, messageFilter?: (message: IMessage) => boolean): Promise<IMessage[]> {
    return this.get(`/inboxes/${inboxID}/messages`)
      .then((messages) => {
        if (messageFilter) {
          return messages.filter(messageFilter);
        }
        return messages;
      });
  }

  public deleteMessage(inboxID: number, messageID: number) {
    return this.client.delete(`/inboxes/${inboxID}/messages/${messageID}`).then(this.formatResponse);
  }

  public deleteMessages(inboxID: number, messageFilter?: (message: IMessage) => boolean) {
    return this.getMessages(inboxID, messageFilter)
      .then((messages) => Promise.all(messages.map((message) => this.deleteMessage(inboxID, message.id))));
  }

  public getMessageBody(inboxID: number, messageID: number, bodyType: MessageBodyType) {
    return this.get(`/inboxes/${inboxID}/messages/${messageID}/body.${bodyType.toString()}`);
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

  private isWaitTimeoutExceeded(startTime: moment.Moment): boolean {
    const duration = moment.duration(moment().diff(startTime));
    if (this.waitTimeout - duration.asMilliseconds() > 0) {
      return false;
    }
    return true;
  }

  private formatResponse(response: AxiosResponse) {
    return JSON.parse(util.format("%j", response.data));
  }
}
