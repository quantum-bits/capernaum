import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  SurveyDimensionResolver,
  SurveyIndexResolver,
  SurveyItemResolver,
  SurveyItemResponseResolver,
  SurveyLetterResolver,
  SurveyResolver,
  SurveyResponseResolver,
} from "./resolvers/";
import {
  SurveyDimensionService,
  SurveyIndexService,
  SurveyItemResponseService,
  SurveyLetterService,
  SurveyResponseService,
  SurveyService,
} from "./services/";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyLetter,
  SurveyResponse,
} from "./entities";
import { registerEnumType } from "@nestjs/graphql";
import { WhichItems } from "./survey.types";
import { GroupModule } from "@server/src/group/group.module";
import { SurveyItemService } from "@server/src/survey/services/survey-item.service";
import { SurveyAnalyticsService } from "@server/src/survey/services/survey-analytics.service";
import { LetterModule } from "@server/src/letter/letter.module";
import { PredictionTable } from "@server/src/prediction/entities";
import { Group } from "@server/src/group/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyIndex,
      SurveyDimension,
      SurveyResponse,
      SurveyItemResponse,
      SurveyItem,
      SurveyLetter,
      PredictionTable,
      Group,
    ]),
    GroupModule,
    forwardRef(() => LetterModule),
  ],
  providers: [
    SurveyDimensionResolver,
    SurveyDimensionService,
    SurveyIndexResolver,
    SurveyIndexService,
    SurveyItemResolver,
    SurveyItemService,
    SurveyItemResponseResolver,
    SurveyItemResponseService,
    SurveyResolver,
    SurveyService,
    SurveyResponseResolver,
    SurveyResponseService,
    SurveyLetterResolver,
    SurveyLetterService,
    SurveyAnalyticsService,
  ],
  exports: [SurveyService, SurveyResponseService, SurveyAnalyticsService],
})
export class SurveyModule {
  constructor() {
    registerEnumType(WhichItems, {
      name: "WhichItems",
      description:
        "Which items to retrieve: all, those with an index, those without an index",
    });
  }
}
