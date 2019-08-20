import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  SurveyDimensionResolver,
  SurveyResolver,
  SurveyIndexResolver
} from "./survey.resolvers";
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
  providers: [
    SurveyService,
    SurveyResolver,
    SurveyDimensionResolver,
    SurveyIndexResolver
  ]
})
export class SurveyModule {}
