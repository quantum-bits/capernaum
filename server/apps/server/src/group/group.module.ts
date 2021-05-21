import { Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupResolver } from "./group.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./entities";
import { MailModule } from "@server/src/mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([Group]), MailModule],
  providers: [GroupService, GroupResolver],
  exports: [GroupService],
})
export class GroupModule {}
