import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";

@Module({
  imports: [GroupModule],
})
export class CliModule {}
