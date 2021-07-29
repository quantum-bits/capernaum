import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { options as typeORMConfig } from "@server/src/typeorm-config";
import { WriterModule } from "@server/src/writer/writer.module";
import { QueueModule } from "@reporter/src/queue/queue.module";
import { ReportModule } from "@reporter/src/report/report.module";
import { VisualizationModule } from "@server/src/visualization/visualization.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeORMConfig,
    }),
    GroupModule,
    WriterModule,
    QueueModule,
    ReportModule,
    VisualizationModule,
  ],
})
export class CliModule {}
