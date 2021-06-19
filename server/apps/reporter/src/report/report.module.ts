import { Module } from "@nestjs/common";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { LetterModule } from "@server/src/letter/letter.module";
import { makeCounterProvider } from "@willsoto/nestjs-prometheus";
import { PROM_METRIC_EMAILS_SENT } from "@common/common.constants";
import { SurveyModule } from "@server/src/survey/survey.module";
import { ReportProcessor } from "@reporter/src/report/report.processor";
import { GroupModule } from "@server/src/group/group.module";

@Module({
  imports: [
    QualtricsApiModule,
    QualtricsModule,
    WriterModule,
    MailModule,
    EventModule,
    LetterModule,
    SurveyModule,
    GroupModule,
  ],
  providers: [
    makeCounterProvider({
      name: PROM_METRIC_EMAILS_SENT,
      help: "Number of emails sent",
    }),
    ReportProcessor,
  ],
  exports: [ReportProcessor],
})
export class ReportModule {}
