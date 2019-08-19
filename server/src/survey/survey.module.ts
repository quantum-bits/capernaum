import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyResolver } from "./survey.resolvers";
import { SurveyService } from "./survey.service";
import { Survey, SurveyDimension, SurveyIndex, SurveyItem } from "./entities";
import { QualtricsModule } from "../qualtrics/qualtrics.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyIndex,
      SurveyDimension,
      SurveyItem
    ]),
    QualtricsModule
  ],
  providers: [SurveyService, SurveyResolver]
})
export class SurveyModule {}
