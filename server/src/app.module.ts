import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LetterModule } from "./letter/letter.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { Letter, LetterElement, LetterElementType } from "./letter/entities";
import { SurveyModule } from "./survey/survey.module";
import typeORMConfig from "./typeorm-config";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem
} from "./survey/entities";
import {
  PredictionTable,
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "./prediction/entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ... typeORMConfig,
      synchronize: true,
      logging: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql"
    }),
    LetterModule,
    QualtricsModule,
    SurveyModule
  ]
})
export class AppModule {}
