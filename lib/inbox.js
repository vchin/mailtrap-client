import moment from 'moment';
import Client from './client';

export default class Inbox {
  constructor(apiToken, inboxName) {
    this.inboxName = inboxName;
    this.client = new Client(apiToken);
    this.defaultTimeout = 60000;
    this.pollingInterval = 1000;
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
   * @param {string} emailAddress
   * @return {Object} see mailtrap api
   */
  getMessagesByTOEmailAddress(emailAddress) {
    return this.getMessages()
      .then((messages) => messages.filter((m) => m.to_email === emailAddress));
  }

  waitForMessages(emailAddress, expectedCount = 1, startTime = null, timeout = this.defaultTimeout) {
    if (startTime === null) {
      startTime = moment();
    }
    return this.getMessagesByTOEmailAddress(emailAddress)
      .then((messages) => {
        if (messages.length >= expectedCount) {
          return Promise.resolve(messages);
        }
        const duration = moment.duration(moment().diff(startTime));
        const timeRemaining = timeout - duration.asMilliseconds();
        if (timeRemaining > 0) {
          return new Promise((resolve) => setTimeout(resolve, this.pollingInterval))
            .then(() => this.waitForMessages(emailAddress, expectedCount, startTime, timeout));
        }
        return Promise.reject(new Error(`timed out waiting for email count >= ${ expectedCount } to ${ emailAddress }`));
      });
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
  deleteAllMessagesMatchingTOEmailAddress(toEmailAddress) {
    return this.getMessagesByEmail(toEmailAddress)
      .then((messages) => messages.map((message) => message.id))
      .then((ids) => Promise.all(ids.map((id) => this.deleteMessage(id))));
  }
}
