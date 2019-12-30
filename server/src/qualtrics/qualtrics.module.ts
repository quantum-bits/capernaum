import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { forwardRef, Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventService } from "../events/event.service";

@Module({
  imports: [forwardRef(() => SurveyModule)],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService, EventService],
  exports: [QualtricsService]
})
export class QualtricsModule {}
