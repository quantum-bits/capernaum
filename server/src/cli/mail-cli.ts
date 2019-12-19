import { join } from "path";
import { config } from "dotenv";
config({
  path: join(__dirname, "../../.env")
});

import { MailService } from "../mail/mail.service";
import { SendMailInput } from "../mail/entities";
import commander from "commander";
import debug from "debug";

const mailDebug = debug("mail");

const program = new commander.Command();
program
  .version("0.0.1")
  .requiredOption("-f --from <sender>")
  .requiredOption("-t --to <recipient>")
  .requiredOption("-s --subject <subject>")
  .requiredOption("-x --text <text-content>")
  .option("-h --html <html-content>")
  .option("-a --attachment <attachment-path>")
  .parse(process.argv);

mailDebug("mail-cli %O", program);

const mailInput: SendMailInput = {
  from: program.from,
  to: program.to,
  subject: program.subject,
  textContent: program.text
};

if (program.htmlContent) {
  mailInput.htmlContent = program.html;
}

if (program.attachment) {
  mailInput.attachmentPath = program.attachment;
}

mailDebug("mail-cli %O", mailInput);

const mailService = new MailService();

mailService
  .sendMail(mailInput)
  .then(result => console.log("RESULT", result))
  .catch(err => console.error("ERROR", err));
