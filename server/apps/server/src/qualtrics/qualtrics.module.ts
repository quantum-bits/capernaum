import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { MailModule } from "../mail/mail.module";
import { WriterModule } from "../writer/writer.module";

@Module({
  imports: [SurveyModule, EventModule, WriterModule, MailModule],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService],
})
export class QualtricsModule {}
