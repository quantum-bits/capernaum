import { join } from "path";
import { config } from "dotenv";
config({
  path: join(__dirname, "../../.env")
});

import { MailService } from "../mail/mail.service";
import commander from "commander";

const program = new commander.Command();
program
  .version("0.0.1")
  .requiredOption("-f --from <sender>")
  .requiredOption("-t --to <recipient>")
  .requiredOption("-s --subject <subject>")
  .requiredOption("-m --message <message>")
  .parse(process.argv);

const mailService = new MailService();
mailService
  .sendMail(program.from, program.to, program.subject, program.message)
  .then(result => console.log("RESULT", result))
  .catch(err => console.error("ERROR", err));
