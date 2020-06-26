import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { MailModule } from "../mail/mail.module";
import { WriterModule } from "../writer/writer.module";
import { ReporterProducer } from "./reporter.producer";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../../common.constants";

@Module({
  imports: [
    SurveyModule,
    EventModule,
    WriterModule,
    MailModule,
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService, ReporterProducer],
})
export class QualtricsModule {}
