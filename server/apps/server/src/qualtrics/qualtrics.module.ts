import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";
import { ReportQueueProducerModule } from "@reporter/src/producer/report-queue-producer.module";
import { QualtricsApiModule } from "@qapi/qualtrics-api.module";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { GroupModule } from "@server/src/group/group.module";

@Module({
  imports: [
    EventModule,
    SurveyModule,
    QualtricsApiModule,
    ReportQueueProducerModule,
    GroupModule,
  ],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService],
})
export class QualtricsModule {}
