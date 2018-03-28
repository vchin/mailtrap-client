export class Options {
  constructor(
    public apiToken: string,
    public jwtToken: string,
  ) {}
}

export class InboxFilter {
  id: number;
  name: string;

  byID(id) {
    this.id = id;
  }

  byName(name) {
    this.name = name;
  }
}

export class MessageFilter {
  messageID: number;
  toEmailAddress: string;

  byMessageID(id) {
    this.messageID = id;
  }

  byToEmailAddress(emailAddress) {
    this.toEmailAddress = emailAddress;
  }
}

export default class Client {
  constructor(public options: Options) {}

  async get(url) {

  }

  async getInboxes(filter: InboxFilter) {

  }

  async getMessages(inboxID: number, filter: MessageFilter) {

  }

  async deleteMessages(inboxID: number, filter: MessageFilter) {

  }

  async getMessageBody(bodyType) {

  }
}
