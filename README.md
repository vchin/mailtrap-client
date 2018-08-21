[![CircleCI](https://circleci.com/gh/vchin/mailtrap-client/tree/master.svg?style=svg)](https://circleci.com/gh/vchin/mailtrap-client/tree/master)[![codecov](https://codecov.io/gh/vchin/mailtrap-client/branch/master/graph/badge.svg)](https://codecov.io/gh/vchin/mailtrap-client)

# mailtrap.io client
Simple mailtrap.io client and helper library

# Install
```
npm install --save-dev mailtrap
```
# Usage Examples
## init
```js
const client = new Client({
  apiToken: 'apiToken'
});
const inbox = new Inbox(client, 'inboxName');
```
## wait for messages
```js
await inbox.waitForMessages((messages) => messages.length > 2);
```
## get messages
```js
const messages = await inbox.getMessages();
const filteredMessages = await inbox.getMessages((m) => m.subject === 'subject');
```
## delete messages
```js
await inbox.deleteMessages();
await inbox.deleteMessages((m) => m.subject === 'subject');
```
## get message body
```js
const msgID = filteredMessages[0].id;
const txt = await client.getMessageBody(inbox.ID, msgID, 'txt');
const html = await client.getMessageBody(inbox.ID, msgID, 'html');
```
