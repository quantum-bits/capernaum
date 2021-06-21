import { Module } from "@nestjs/common";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { MailModule } from "@server/src/mail/mail.module";
import { EventModule } from "@server/src/events/event.module";
import { LetterModule } from "@server/src/letter/letter.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { GroupModule } from "@server/src/group/group.module";
import { ReportService } from "@reporter/src/report/report.service";
import { makeCounterProvider } from "@willsoto/nestjs-prometheus";
import { PROM_METRIC_EMAILS_SENT } from "@common/common.constants";

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
    ReportService,
  ],
  exports: [ReportService],
})
export class ReportModule {}
