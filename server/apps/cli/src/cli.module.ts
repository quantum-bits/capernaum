import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { options as typeORMConfig } from "@server/src/typeorm-config";
import { WriterModule } from "@server/src/writer/writer.module";
import { ReportModule } from "@reporter/src/report/report.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
    }),
    QualtricsModule,
    GroupModule,
    WriterModule,
    ReportModule,
  ],
})
export class CliModule {}
