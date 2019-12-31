import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { forwardRef, Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";
import { QualtricsController } from "./qualtrics.controller";
import { EventModule } from "../events/event.module";

@Module({
  imports: [forwardRef(() => SurveyModule), EventModule],
  controllers: [QualtricsController],
  providers: [QualtricsResolver, QualtricsService],
  exports: [QualtricsService]
})
export class QualtricsModule {}
