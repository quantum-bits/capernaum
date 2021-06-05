import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { options as typeORMConfig } from "@server/src/typeorm-config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
    }),
    QualtricsModule,
    GroupModule,
  ],
})
export class CliModule {}
