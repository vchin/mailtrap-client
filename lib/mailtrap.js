import axios from 'axios';
import util from 'util';

const baseURL = 'https://mailtrap.io/api/v1';

function formatResponse(res) {
  return JSON.parse(util.format('%j', res.data));
}

export class Client {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Token token=${ apiToken }`,
      },
    });
  }

  /**
   * GET request to mailtrap.io
   * @param {string} url
   */
  get(url) {
    return this.client.get(url)
      .then(formatResponse);
  }

  /**
   * Get all inboxes available
   */
  getInboxes() {
    return this.get('/inboxes');
  }

  /**
   * Returns first inbox found by name
   * @param {string} name
   */
  getInboxByName(name) {
    return this.getInboxes()
      .then((inboxes) => inboxes.find((i) => i.name === name));
  }

  /**
   * Returns all messages in inboxID
   * @param {number} inboxID
   */
  getMessages(inboxID) {
    return this.get(`/inboxes/${ inboxID }/messages`);
  }

  /**
   * Delete message
   * @param {number} inboxID
   * @param {number} messageID
   */
  deleteMessage(inboxID, messageID) {
    return this.client.delete(`/inboxes/${ inboxID }/messages/${ messageID }`)
      .then(formatResponse);
  }
}

export class Inbox {
  constructor(apiToken, inboxName) {
    this.inboxName = inboxName;
    this.client = new Client(apiToken);
  }

  /**
   * Initialize default mailbox
   */
  init() {
    return this.client.getInboxByName(this.inboxName)
      .then((inbox) => {
        this.inbox = inbox;
      });
  }

  /**
   * Returns all messages in inbox
   */
  getMessages() {
    return this.client.getMessages(this.inbox.id);
  }

  /**
   * Get all messages matching 'to' email address
   * @param {string} email
   * @return {Object} see mailtrap api
   */
  getMessagesByEmail(email) {
    return this.getMessages()
      .then((messages) => messages.filter((m) => m.to_email === email));
  }

  /**
   * Delete message in inbox by id
   * @param {number} id
   */
  deleteMessage(id) {
    return this.client.deleteMessage(this.inbox.id, id);
  }

  /**
   * Deletes all messages matching toEmailAddress
   * @param {string} toEmailAddress email address in to field
   * @return {*} empty
   */
  deleteAllMessagesByTOEmailAddress(toEmailAddress) {
    return this.getMessagesByEmail(toEmailAddress)
      .then((messages) => messages.map((message) => message.id))
      .then((ids) => Promise.all(ids.map((id) => this.deleteMessage(id))));
  }
}
