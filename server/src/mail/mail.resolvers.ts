import { Args, Resolver } from "@nestjs/graphql";
import { MailService } from "./mail.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Mutation } from "type-graphql";
import { SendLetterInput } from "./entities/mail";
import { Any } from "typeorm";

@Resolver()
// @UseGuards(GqlAuthGuard)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(returns => String)
  sendLetter(@Args("letterInput") letterInput: SendLetterInput) {
    return this.mailService.sendMail(
      process.env.MAIL_FROM,
      letterInput.to,
      letterInput.subject,
      letterInput.text
    );
  }
}
