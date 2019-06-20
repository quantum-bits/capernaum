import { SurveyResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";

@Module({
  providers: [SurveyResolver]
})
export class QualtricsModule {}
