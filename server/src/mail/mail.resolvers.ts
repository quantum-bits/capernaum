import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { MailService } from "./mail.service";
import { SendMailInput } from "./entities/mail";
import debug from "debug";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

const mailDebug = debug("mail");

@Resolver()
@UseGuards(GqlAuthGuard)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(returns => String)
  sendLetter(@Args("mailInput") mailInput: SendMailInput) {
    return this.mailService.sendMail(mailInput);
  }
}
