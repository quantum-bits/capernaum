import { Module } from "@nestjs/common";
import { ReportProcessor } from "@reporter/src/queue/report.processor";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { LetterModule } from "@server/src/letter/letter.module";
import { makeCounterProvider } from "@willsoto/nestjs-prometheus";
import { PROM_METRIC_EMAILS_SENT } from "@common/common.constants";
import { SurveyModule } from "@server/src/survey/survey.module";

@Module({
  imports: [
    // BullModule.registerQueue({
    //   name: REPORTER_QUEUE_NAME,
    // }),
    QualtricsApiModule,
    QualtricsModule,
    WriterModule,
    MailModule,
    EventModule,
    LetterModule,
    SurveyModule,
  ],
  providers: [
    makeCounterProvider({
      name: PROM_METRIC_EMAILS_SENT,
      help: "Number of emails sent",
    }),
    ReportProcessor,
  ],
})
export class ReportModule {}
