import { Module } from "@nestjs/common";
import { GroupService, GroupTypeService } from "./group.service";
import { GroupResolver, GroupTypeResolver } from "./group.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group, GroupType } from "./entities";
import { MailModule } from "@server/src/mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupType]), MailModule],
  providers: [GroupService, GroupResolver, GroupTypeService, GroupTypeResolver],
  exports: [GroupService],
})
export class GroupModule {}
