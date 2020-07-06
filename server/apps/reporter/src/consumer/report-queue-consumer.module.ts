import { Module } from "@nestjs/common";
import { ReportQueueConsumer } from "./report-queue-consumer";
import { SurveyModule } from "@server/src/survey/survey.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeORMConfig from "@server/src/typeorm-config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      // logging: inDevelopmentMode(),
    }),
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
    SurveyModule,
    EventModule,
    WriterModule,
    MailModule,
    QualtricsApiModule,
  ],
  providers: [ReportQueueConsumer],
  exports: [ReportQueueConsumer],
})
export class ReportQueueConsumerModule {}
