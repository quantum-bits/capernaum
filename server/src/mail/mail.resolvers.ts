import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { MailService } from "./mail.service";
import { SendMailInput } from "./entities/mail";
import debug from "debug";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { QualtricsImportInput } from "../survey/entities";

const mailDebug = debug("mail");

@Resolver()
@UseGuards(GqlAuthGuard)
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
