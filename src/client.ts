import axios, { AxiosInstance, AxiosResponse } from "axios";
import util = require("util");
import { ClientOptions } from "./ClientOptions";
import { Inbox } from "./Inbox";
import { Message } from "./Message";
import { MessageBodyType } from "./MessageBodyType";

const baseURL = "https://mailtrap.io/api/v1";

function formatResponse(response: AxiosResponse) {
  return JSON.parse(util.format("%j", response.data));
}

export class Client {
  private client: AxiosInstance;

  constructor(options: ClientOptions) {
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
      baseURL,
      headers,
    });
  }

  public get(url: string) {
    return this.client.get(url).then(formatResponse);
  }

  public getInboxes(inboxFilter: (inbox: Inbox) => boolean): Promise<Inbox[]> {
    return this.get("/inboxes")
      .then((inboxes) => {
        if (inboxFilter) {
          return inboxes.filter(inboxFilter);
        }
        return inboxes;
      });
  }

  public getMessages(inboxID: number, messageFilter: (message: Message) => boolean): Promise<Message[]> {
    return this.get(`/inboxes/${inboxID}/messages`)
      .then((messages) => {
        if (messageFilter) {
          return messages.filter(messageFilter);
        }
        return messages;
      });
  }

  public deleteMessage(inboxID: number, messageID: number) {
    return this.client.delete(`/inboxes/${inboxID}/messages/${messageID}`).then(formatResponse);
  }

  public deleteMessages(inboxID: number, messageFilter: (message: Message) => boolean) {
    return this.getMessages(inboxID, messageFilter)
      .then((messages) =>
        Promise.all(messages.map((message) => this.deleteMessage(inboxID, message.id))),
      );
  }

  /**
   * Returns the message body of a message by body type
   * @param inboxID
   * @param messageID
   * @param bodyType
   */
  public getMessageBody(inboxID: number, messageID: number, bodyType: MessageBodyType) {
    return this.get(`/inboxes/${inboxID}/messages/${messageID}/body.${bodyType.toString()}`);
  }
}
