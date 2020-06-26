import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailResolver } from "./mail.resolvers";

@Module({
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
