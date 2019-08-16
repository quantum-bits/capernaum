import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyResolver } from "./survey.resolvers";
import { SurveyService, SurveyItemService } from "./survey.service";
import { Survey, SurveyIndex, SurveyItem, SurveyDimension } from "./entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey, SurveyDimension, SurveyIndex, SurveyItem])
  ],
  providers: [SurveyService, SurveyResolver, SurveyItemService]
})
export class SurveyModule {}
