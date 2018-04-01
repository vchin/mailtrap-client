"use strict";

module.exports = class Message {
  constructor(client, message) {
    this.client = client;
    Object.keys(message).forEach(key => {
      this[key] = message[key];
    });
  }
  /**
   * Return message body, returns html body by default
   * @param {string} type html(default)|txt|raw|eml
   */


  getBody(type = 'html') {
    return this.client.getMessageBody(this.inbox_id, this.id, type);
  }

};
