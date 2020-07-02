import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeORMConfig from "@server/src/typeorm-config";
import { inDevelopmentMode } from "@server/src/shared/helpers";
import { JobQueueModule } from "@apps/reporter/src/job-queue/job-queue.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      logging: inDevelopmentMode(),
    }),
    JobQueueModule,
  ],
})
export class AppModule {}
