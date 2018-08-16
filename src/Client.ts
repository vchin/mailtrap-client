import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as util from "util";
import { MessageBodyType } from "./MessageBodyType";
import { IInbox } from "./IInbox";
import { IMessage } from "./IMessage";

export interface ICredentials {
  apiToken?: string;
  jwt?: string;
}

export interface IClientOptions {
  credentials: ICredentials;
  pollingInterval?: number;
  timeout?: number;
  endpoint?: string;
}

export class Client {
  private readonly client: AxiosInstance;
  private readonly pollingInterval: number;
  private readonly timeout: number;
  constructor(private readonly options: IClientOptions) {
    if (!options.credentials.apiToken && !options.credentials.jwt) {
      throw new Error("Must initialize Client with credentials");
    }
    this.pollingInterval = options.pollingInterval || 1000;
    this.timeout = options.timeout || 60000;
    this.client = axios.create({
      baseURL: options.endpoint || "https://mailtrap.io/api/v1",
      headers: {
        Authorization: options.credentials.apiToken ? `Token token=${options.credentials.apiToken}` : `Bearer ${options.credentials.jwt}`
      },
    })
  }

  private formatResponse(response: AxiosResponse) {
    return JSON.parse(util.format("%j", response.data));
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
      .then((messages) => Promise.all(messages.map((message) => this.deleteMessage(inboxID, message.id))))
  }

  public getMessageBody(inboxID: number, messageID: number, bodyType: MessageBodyType) {
    return this.get(`/inboxes/${inboxID}/messages/${messageID}/body.${bodyType.toString()}`);
  }
}
