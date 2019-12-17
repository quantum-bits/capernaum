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
    const port = parseInt(process.env.MAIL_PORT);
    const isSecure = port == 465;

    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      logger: true,
      debug: true
    };
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
    mailDebug("semdMail options %O", options);
    return this.transporter.sendMail(options);
  }
}
