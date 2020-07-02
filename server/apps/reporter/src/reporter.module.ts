import { forwardRef, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";
import { SurveyModule } from "@server/src/survey/survey.module";
import { EventModule } from "@server/src/events/event.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { MailModule } from "@server/src/mail/mail.module";
import { ReporterProducer } from "@apps/reporter/src/reporter.producer";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeORMConfig from "@server/src/typeorm-config";
import { inDevelopmentMode } from "@server/src/shared/helpers";
import { ReporterConsumer } from "@apps/reporter/src/reporter.consumer";
import { QualtricsApiModule } from "@qapi/qualtrics-api";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      logging: inDevelopmentMode(),
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
  providers: [ReporterProducer, ReporterConsumer],
  exports: [ReporterProducer],
})
export class ReporterModule {}
