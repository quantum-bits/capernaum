import { Module } from "@nestjs/common";
import { JobQueueProducer } from "./job-queue.producer";
import { JobQueueConsumer } from "./job-queue-consumer";
import { SurveyModule } from "@server/src/survey/survey.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
    SurveyModule,
    EventModule,
    WriterModule,
    MailModule,
    QualtricsApiModule,
  ],
  providers: [JobQueueProducer, JobQueueConsumer],
  exports: [JobQueueProducer, JobQueueConsumer],
})
export class JobQueueModule {}
