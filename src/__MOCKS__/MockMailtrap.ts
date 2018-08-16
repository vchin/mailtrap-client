/* tslint:disable */
import express = require("express");

const app = express();

export const inboxes = [
  {
    id: 3,
    company_id: 1,
    name: "Test inbox",
    domain: "smtp.mailtrap.io",
    username: "1da91769512fb",
    password: "d71dfda027b54a",
    status: "active",
    max_size: 1000,
    emails_count: 997,
    emails_unread_count: 0,
    email_username: "example-username",
    email_username_enabled: false,
    email_domain: "inbox.mailtrap.io",
    last_message_sent_at_timestamp: 1380567707,
    smtp_ports: [
      25,
      465,
      2525,
    ],
    pop3_ports: [
      1100,
      9950,
    ],
    has_inbox_address: false,
  },
];

export const messages = [
  {
    id: 54864,
    inbox_id: 1,
    subject: "SMTP e-mail test",
    sent_at: "2013-08-25T19:32:07.567+03:00",
    from_email: "me@railsware.com",
    from_name: "Private Person",
    to_email: "test@railsware.com",
    to_name: "A Test User",
    html_body: "",
    text_body: "This is a test e-mail message.\r\n",
    email_size: 193,
    is_read: true,
    created_at: "2013-08-25T19:32:07.576+03:00",
    updated_at: "2013-08-25T19:32:09.232+03:00",
    sent_at_timestamp: 1377448326,
    human_size: "193 Bytes",
    html_path: "/api/v1/inboxes/1/messages/54864/body.html",
    txt_path: "/api/v1/inboxes/1/messages/54864/body.txt",
    raw_path: "/api/v1/inboxes/1/messages/54864/body.raw",
    download_path: "/api/v1/inboxes/1/messages/54864/body.eml",
    viruses_report_info: false,
    blacklists_report_info: {
      result: "success",
      domain: "railsware.com",
      ip: "176.9.59.196",
      report: [
        {
          name: "AHBL",
          url: "http://www.ahbl.org/",
          in_black_list: false,
        },
      ],
    },
  },
  {
    id: 54863,
    inbox_id: 3,
    subject: "SMTP e-mail test",
    sent_at: "2013-08-25T19:32:07.051+03:00",
    from_email: "me@railsware.com",
    from_name: "Private Person",
    to_email: "test@railsware.com",
    to_name: "A Test User",
    html_body: "",
    text_body: "This is a test e-mail message.\r\n",
    email_size: 193,
    is_read: true,
    created_at: "2013-08-25T19:32:07.061+03:00",
    updated_at: "2013-08-25T19:32:08.603+03:00",
    sent_at_timestamp: 1377448326,
    human_size: "193 Bytes",
    html_path: "/api/v1/inboxes/1/messages/54863/body.html",
    txt_path: "/api/v1/inboxes/1/messages/54863/body.txt",
    raw_path: "/api/v1/inboxes/1/messages/54863/body.raw",
    download_path: "/api/v1/inboxes/1/messages/54863/body.eml",
    viruses_report_info: false,
    blacklists_report_info: {
      result: "success",
      domain: "railsware.com",
      ip: "176.9.59.196",
      report: [
        {
          name: "AHBL",
          url: "http://www.ahbl.org/",
          in_black_list: false,
        },
        {
          name: "BACKSCATTERER",
          url: "http://www.backscatterer.org/index.php",
          in_black_list: false,
        },
      ],
    },
  },
];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get("/inboxes", (req, res) => {
  res.json(inboxes);
});

app.get("/inboxes/:inboxID", (req, res) => {
  const inboxID = req.params.inboxID;
  res.json(inboxes.find((i) => i.id === parseInt(inboxID)));
});

app.get("/inboxes/:inboxID/messages", (req, res) => {
  const inboxID = req.params.inboxID;
  res.json(messages.filter((m) => m.inbox_id === parseInt(inboxID)));
});

app.get("/inboxes/:inboxID/messages/:messageID", (req, res) => {
  const inboxID = req.params.inboxID;
  const messageID = req.params.messageID;
  res.json(messages.find((m) => m.id === parseInt(messageID) && m.inbox_id === parseInt(inboxID)));
});

app.delete("/inboxes/:inboxID/messages/:messageID", (req, res) => {
  res.send("ok");
});

app.get("/inboxes/:inboxID/messages/:messageID/body.html", (req, res) => {
  res.send("html");
});

app.get("/inboxes/:inboxID/messages/:messageID/body.txt", (req, res) => {
  res.send("txt");
});

app.get("/inboxes/:inboxID/messages/:messageID/body.raw", (req, res) => {
  res.send("raw");
});

app.get("/inboxes/:inboxID/messages/:messageID/body.eml", (req, res) => {
  res.send("eml");
});

export const mock = app.listen(3000, () => {
  console.log("Mock server started on port 3000");
});
