import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  SurveyDimensionResolver,
  SurveyIndexResolver,
  SurveyItemResolver,
  SurveyItemResponseResolver,
  SurveyResolver,
  SurveyResponseResolver,
} from "./survey.resolvers";
import {
  SurveyDimensionService,
  SurveyIndexService,
  SurveyService,
} from "./survey.service";
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
    ]),
    GroupModule,
  ],
  providers: [
    SurveyService,
    SurveyResolver,
    SurveyDimensionService,
    SurveyIndexService,
    SurveyDimensionResolver,
    SurveyResponseResolver,
    SurveyItemResponseResolver,
    SurveyIndexResolver,
    SurveyItemResolver,
  ],
  exports: [SurveyService],
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
