import { Module } from "@nestjs/common";
import { ReportQueueConsumer } from "./report-queue-consumer";
import { SurveyModule } from "@server/src/survey/survey.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@common/common.constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { options as typeORMConfig } from "@server/src/typeorm-config";
import {
  makeCounterProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import { PROM_METRIC_EMAILS_SENT } from "@reporter/src/common";

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
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [
    ReportQueueConsumer,
    makeCounterProvider({
      name: PROM_METRIC_EMAILS_SENT,
      help: "Number of emails sent",
    }),
  ],
  exports: [ReportQueueConsumer],
})
export class ReportQueueConsumerModule {}
