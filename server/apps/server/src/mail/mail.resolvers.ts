import { Args, Resolver, Mutation } from "@nestjs/graphql";
import { MailService } from "./mail.service";
import { SendMailInput, SendMailResponse } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver()
@UseGuards(GqlAuthGuard)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => SendMailResponse)
  sendLetter(@Args("mailInput") mailInput: SendMailInput) {
    return this.mailService.sendMail(mailInput);
  }
}
