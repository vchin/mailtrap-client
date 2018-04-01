"use strict";

const moment = require('moment');

const Client = require('./client');

const Message = require('./message');

module.exports = class Inbox {
  constructor(apiToken, inboxName) {
    this.inboxName = inboxName;
    this.inboxID = null;
    this.client = new Client(apiToken);
    this.defaultTimeout = 180000;
    this.pollingInterval = 1000;
  }
  /**
   * Initialize default mailbox
   */


  init() {
    return this.client.getInboxByName(this.inboxName).then(inbox => {
      this.inboxID = inbox.id;
    });
  }
  /**
   * Returns all messages in inbox
   */


  getMessages(filter) {
    return this.client.getMessages(this.inboxID).then(messages => {
      let filteredMessages = messages;

      if (filter) {
        filteredMessages = messages.filter(message => {
          let match = true;

          if (filter.toEmail) {
            match = match && message.to_email === filter.toEmail;
          }

          return match;
        });
      }

      return filteredMessages;
    }).then(messages => messages.map(message => new Message(this.client, message)));
  }

  waitForMessages(filter, expectedCount = 1, timeout = this.defaultTimeout, startTime = null) {
    if (startTime === null) {
      startTime = moment();
    }

    return this.getMessages(filter).then(messages => {
      if (messages.length >= expectedCount) {
        return Promise.resolve(messages);
      }

      const duration = moment.duration(moment().diff(startTime));
      const timeRemaining = timeout - duration.asMilliseconds();

      if (timeRemaining > 0) {
        return new Promise(resolve => setTimeout(resolve, this.pollingInterval)).then(() => this.waitForMessages(filter, expectedCount, timeout, startTime));
      }

      return [];
    });
  }
  /**
   * Delete message in inbox by id
   * @param {number} id
   */


  deleteMessage(id) {
    if (id) {
      return this.client.deleteMessage(this.inboxID, id);
    }

    return Promise.resolve();
  }
  /**
   * Deletes all messages matching filter
   * @param {Object} filter
   */


  deleteMessages(filter) {
    return this.getMessages(filter).then(messages => messages.map(message => message.id)).then(ids => Promise.all(ids.map(id => this.deleteMessage(id))));
  }

};
