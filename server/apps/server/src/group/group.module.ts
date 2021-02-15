import { Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupResolver } from "./group.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [GroupService, GroupResolver],
  exports: [GroupService],
})
export class GroupModule {}
