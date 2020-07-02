import { QualtricsApiService } from "@qapi/qualtrics-api/qualtrics-api.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";
import { ReporterModule } from "@apps/reporter/src/reporter.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
    EventModule,
    ReporterModule,
    SurveyModule,
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsApiService],
})
export class QualtricsModule {}
