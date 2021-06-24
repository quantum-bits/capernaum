import NestContext from "@common/cli/src/nest-helpers";
import { MailService } from "@server/src/mail/mail.service";
import { DateTime } from "luxon";
import { printPretty } from "@helpers/formatting";
import { getDebugger } from "@helpers/debug-factory";
import { SendMailInput } from "@server/src/mail/entities";

const debug = getDebugger("cli");

export async function sendTestEmail() {
  const nestContext = new NestContext();
  const mailService = await nestContext.get(MailService);

  const mailInput: SendMailInput = {
    to: "tom.nurkkala@gmail.com",
    htmlContent: "<p>Hello, Email HTML</p>",
    textContent: "Hello, Email Text",
    subject: `Test email ${DateTime.now()}`,
  };

  debug("Sending mail %O", mailInput);
  const result = await mailService.sendMail(mailInput);
  debug("Result %O", result);

  await nestContext.close();

  printPretty(result);
}
