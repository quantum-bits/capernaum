import { Injectable, Logger } from "@nestjs/common";
import { Transporter, createTransport } from "nodemailer";
import Mail = require("nodemailer/lib/mailer");
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { SendMailInput } from "./entities";
import { getDebugger } from "@helpers/debug-factory";
import prettyFormat from "pretty-format";

const debug = getDebugger("mail");

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      logger: debug.enabled,
      debug: debug.enabled,
      connectionTimeout: 15 * 1000,
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

    debug("transport options %O", options);
    this.transporter = createTransport(options);
    debug("transporter %O", this.transporter);
  }

  async sendMail(mailInput: SendMailInput) {
    if (!mailInput.from) {
      if (!process.env.MAIL_FROM) {
        throw Error("No MAIL_FROM configured");
      }
      mailInput.from = process.env.MAIL_FROM;
    }
    debug("sendMail mailInput - %O", mailInput);

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

    try {
      this.logger.log(`Sending email to ${mailInput.to}`);
      debug("sending mail %O", options);
      const result = await this.transporter.sendMail(options);
      debug("result %O", result);
      return true;
    } catch (error) {
      debug("error %O", error);
      this.logger.error(`Email failed to send ${prettyFormat(error)}`);
      return false;
    }
  }
}
