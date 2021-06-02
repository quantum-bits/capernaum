import debug from "debug";
import { Injectable, Logger } from "@nestjs/common";
import { SentMessageInfo, Transporter, createTransport } from "nodemailer";
import Mail = require("nodemailer/lib/mailer");
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { SendMailInput } from "./entities";

const mailDebug = debug("mail");

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      // logger: true,
      debug: mailDebug.enabled,
    };

    if (process.env.MAIL_PORT) {
      options.port = parseInt(process.env.MAIL_PORT);

      // This doesn't appear to work, at least against a server on port 587.
      // const isSecure = port !== 25;
      // options.secure = isSecure;
    }

    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      options.auth = {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      };
    }

    mailDebug("transport options %O", options);
    this.transporter = createTransport(options);
  }

  sendMail(mailInput: SendMailInput): Promise<SentMessageInfo> {
    if (!mailInput.from) {
      if (!process.env.MAIL_FROM) {
        throw Error("No MAIL_FROM configured");
      }
      mailInput.from = process.env.MAIL_FROM;
    }
    mailDebug("sendMail mailInput - %O", mailInput);

    const options: Mail.Options = {
      from: mailInput.from,
      to: mailInput.to,
      subject: mailInput.subject,
      text: mailInput.textContent,
    };

    if (mailInput.htmlContent) {
      options.html = mailInput.htmlContent;
    }

    if (mailInput.attachmentPath) {
      options.attachments = [
        {
          filename: "CLS Results.pdf",
          path: mailInput.attachmentPath,
        },
      ];
    }

    this.logger.debug(`Sending email to ${mailInput.to}`);
    mailDebug("sendMail options %O", options);
    return this.transporter.sendMail(options);
  }
}
