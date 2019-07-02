import { QualtricsService } from "./qualtrics.service";
import { SurveyResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";

@Module({
  providers: [SurveyResolver, QualtricsService]
})
export class QualtricsModule {}
