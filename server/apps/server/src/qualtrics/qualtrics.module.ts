import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { GroupModule } from "@server/src/group/group.module";
import { ReportModule } from "@reporter/src/queue/report.module";

@Module({
  imports: [
    EventModule,
    SurveyModule,
    QualtricsApiModule,
    ReportModule,
    GroupModule,
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService],
  exports: [QualtricsService],
})
export class QualtricsModule {}
