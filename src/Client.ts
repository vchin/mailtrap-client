import axios, { AxiosInstance, AxiosResponse } from "axios";
import util = require("util");
import { ClientOptions } from "./ClientOptions";
import { Inbox } from "./IInbox";
import { InboxClient } from "./InboxClient";
import { Message } from "./IMessage";
import { MessageBodyType } from "./MessageBodyType";
import { MessageClient } from "./MessageClient";

function formatResponse(response: AxiosResponse) {
  return JSON.parse(util.format("%j", response.data));
}

export class Client {
  public options: ClientOptions;
  private client: AxiosInstance;

  constructor(options: ClientOptions) {
    this.options = options;
    let headers = null;
    if (options) {
      if (options.apiToken) {
        headers = {
          Authorization: `Token token=${options.apiToken}`,
        };
      }
      if (options.jwtToken) {
        headers = {
          Authorization: `Bearer ${options.jwtToken}`,
        };
      }
    }
    if (headers === null) {
      throw new Error("must init client with apiToken or jwtToken");
    }
    this.client = axios.create({
      baseURL: options.endpoint,
      headers,
    });
  }

  public get(url: string) {
    return this.client.get(url).then(formatResponse);
  }

  public getInbox(inboxID: number): Promise<InboxClient> {
    return this.get(`/inboxes/${inboxID}`)
      .then((inbox) => new InboxClient(new Inbox(inbox), this));
  }

  public getInboxes(inboxFilter?: (inbox: Inbox) => boolean): Promise<InboxClient[]> {
    return this.get("/inboxes")
      .then((inboxes) => {
        if (inboxFilter) {
          return inboxes.filter(inboxFilter);
        }
        return inboxes;
      })
      .then((inboxes) => inboxes.map((inbox: object) => new InboxClient(new Inbox(inbox), this)));
  }

  public getMessages(inboxID: number, messageFilter?: (message: Message) => boolean): Promise<MessageClient[]> {
    return this.get(`/inboxes/${inboxID}/messages`)
      .then((messages) => {
        if (messageFilter) {
          return messages.filter(messageFilter);
        }
        return messages;
      })
      .then((messages) => messages.map((message: object) => new MessageClient(new Message(message), this)));
  }

  public deleteMessage(inboxID: number, messageID: number) {
    return this.client.delete(`/inboxes/${inboxID}/messages/${messageID}`).then(formatResponse);
  }

  public deleteMessages(inboxID: number, messageFilter?: (message: Message) => boolean) {
    return this.getMessages(inboxID, messageFilter)
      .then((messages) =>
        Promise.all(messages.map((message) => message.delete())),
      );
  }

  public getMessageBody(inboxID: number, messageID: number, bodyType: MessageBodyType) {
    return this.get(`/inboxes/${inboxID}/messages/${messageID}/body.${bodyType.toString()}`);
  }
}
