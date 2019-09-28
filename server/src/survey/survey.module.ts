import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  SurveyDimensionResolver,
  SurveyIndexResolver,
  SurveyItemResolver,
  SurveyItemResponseResolver,
  SurveyResolver,
  SurveyResponseResolver
} from "./survey.resolvers";
import { SurveyService } from "./survey.service";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyResponse,
  SurveyItemResponse
} from "./entities";
import { QualtricsModule } from "../qualtrics/qualtrics.module";
import { registerEnumType } from "type-graphql";
import { WhichItems } from "./survey.types";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyIndex,
      SurveyDimension,
      SurveyResponse,
      SurveyItemResponse,
      SurveyItem
    ]),
    QualtricsModule
  ],
  providers: [
    SurveyService,
    SurveyResolver,
    SurveyDimensionResolver,
    SurveyResponseResolver,
    SurveyItemResponseResolver,
    SurveyIndexResolver,
    SurveyItemResolver
  ]
})
export class SurveyModule {
  constructor() {
    registerEnumType(WhichItems, {
      name: "WhichItems",
      description:
        "Which items to retrieve: all, those with an index, those without an index"
    });
  }
}
