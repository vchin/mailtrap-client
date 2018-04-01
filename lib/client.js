"use strict";

const axios = require('axios');

const util = require('util');

const baseURL = 'https://mailtrap.io/api/v1';

function formatResponse(res) {
  return JSON.parse(util.format('%j', res.data));
}

module.exports = class Client {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Token token=${apiToken}`
      }
    });
  }
  /**
   * GET request to mailtrap.io
   * @param {string} url
   */


  get(url) {
    return this.client.get(url).then(formatResponse);
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
    return this.getInboxes().then(inboxes => inboxes.find(i => i.name === name));
  }
  /**
   * Returns all messages in inboxID
   * @param {number} inboxID
   */


  getMessages(inboxID) {
    return this.get(`/inboxes/${inboxID}/messages`);
  }

  getMessageBody(inboxID, messageID, type) {
    return this.get(`/inboxes/${inboxID}/messages/${messageID}/body.${type}`);
  }
  /**
   * Delete message
   * @param {number} inboxID
   * @param {number} messageID
   */


  deleteMessage(inboxID, messageID) {
    return this.client.delete(`/inboxes/${inboxID}/messages/${messageID}`).then(formatResponse);
  }

};
