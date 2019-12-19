import { Args, Resolver } from "@nestjs/graphql";
import { MailService } from "./mail.service";
import { Mutation } from "type-graphql";
import { SendMailInput } from "./entities/mail";
import debug from "debug";

const mailDebug = debug("mail");

@Resolver()
// @UseGuards(GqlAuthGuard)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(returns => String)
  sendLetter(@Args("mailInput") mailInput: SendMailInput) {
    if (!mailInput.from) {
      if (!process.env.MAIL_FROM) {
        throw Error("No MAIL_FROM configured");
      }
      mailInput.from = process.env.MAIL_FROM;
    }
    mailDebug("sendLetter %O", mailInput);

    return this.mailService.sendMail(mailInput);
  }
}
