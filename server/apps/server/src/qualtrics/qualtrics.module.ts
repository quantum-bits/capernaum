import { QualtricsApiService } from "@qapi/qualtrics-api/qualtrics-api.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { AppModule } from "@apps/reporter/src/app.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api";
import { JobQueueModule } from "@apps/reporter/src/job-queue/job-queue.module";

@Module({
  imports: [
    EventModule,
    AppModule,
    SurveyModule,
    QualtricsApiModule,
    JobQueueModule,
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver],
})
export class QualtricsModule {}
