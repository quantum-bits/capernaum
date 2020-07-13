import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api";
import { ReportQueueProducerModule } from "@apps/reporter/src/producer/report-queue-producer.module";

@Module({
  imports: [
    EventModule,
    SurveyModule,
    QualtricsApiModule,
    ReportQueueProducerModule,
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver],
})
export class QualtricsModule {}
