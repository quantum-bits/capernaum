import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { forwardRef, Module } from "@nestjs/common";
import { SurveyModule } from "../survey/survey.module";

@Module({
  imports: [forwardRef(() => SurveyModule)],
  providers: [QualtricsResolver, QualtricsService],
  exports: [QualtricsService]
})
export class QualtricsModule {}
