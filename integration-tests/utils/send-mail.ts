import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD,
  },
});

export const sendMail = async (mailOptions: IMailOptions) => {
  await new Promise(resolve => transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    resolve();
  }));
};

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
