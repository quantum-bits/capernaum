import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyResolver } from "./survey.resolvers";
import { SurveyItemService, SurveyService } from "./survey.service";
import { Survey, SurveyDimension, SurveyIndex, SurveyItem } from "./entities";
import { QualtricsModule } from "../qualtrics/qualtrics.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyDimension,
      SurveyIndex,
      SurveyItem
    ]),
    QualtricsModule
  ],
  providers: [SurveyService, SurveyResolver, SurveyItemService]
})
export class SurveyModule {}
