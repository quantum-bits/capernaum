import debug from "debug";
import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import Mail, { Attachment } from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const mailDebug = debug("mail");

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      logger: true,
      debug: true
    };

    if (process.env.MAIL_PORT) {
      const port = parseInt(process.env.MAIL_PORT);
      const isSecure = port == 465;

      options.port = port;
      options.secure = isSecure;
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

  sendMail(
    from: string,
    to: string,
    subject: string,
    text: string,
    attachment?: Attachment
  ) {
    const options: Mail.Options = {
      from,
      to,
      subject,
      text
    };
    if (attachment) {
      options.attachments = [attachment];
    }
    mailDebug("sendMail options %O", options);
    return this.transporter.sendMail(options);
  }
}
