import debug from "debug";
import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SendMailInput } from "./entities";

const mailDebug = debug("mail");

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      logger: true,
      debug: mailDebug.enabled
    };

    if (process.env.MAIL_PORT) {
      const port = parseInt(process.env.MAIL_PORT);
      options.port = port;

      // This doesn't appear to work, at least against a server on port 587.
      // const isSecure = port !== 25;
      // options.secure = isSecure;
    }

    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      options.auth = {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      };
    }

    mailDebug("transport options %O", options);
    this.transporter = nodemailer.createTransport(options);
  }

  sendMail(mailInput: SendMailInput) {
    const options: Mail.Options = {
      from: mailInput.from,
      to: mailInput.to,
      subject: mailInput.subject,
      text: mailInput.textContent
    };

    if (mailInput.htmlContent) {
      options.html = mailInput.htmlContent;
    }

    if (mailInput.attachmentPath) {
      options.attachments = [
        {
          filename: "CLS Results.pdf",
          path: mailInput.attachmentPath
        }
      ];
    }

    mailDebug("sendMail options %O", options);
    return this.transporter.sendMail(options);
  }
}
