import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
} from "@server/src/letter/entities";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { Group, GroupType } from "@server/src/group/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "@server/src/prediction/entities";
import { Image } from "@server/src/image/entities";
import { Connection } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      logging: false,
      entities: [
        Group,
        GroupType,
        Image,
        Letter,
        LetterType,
        LetterElement,
        LetterElementType,
        PredictionTableEntry,
        ScriptureEngagementPractice,
        Survey,
        SurveyDimension,
        SurveyIndex,
        SurveyItem,
        SurveyItemResponse,
        SurveyResponse,
      ],
    }),
    GroupModule,
  ],
})
export class CliModule {
  // constructor(private connection: Connection) {
  //   console.warn("name", connection.name);
  //   console.warn("options", connection.options);
  //   console.warn("connected", connection.isConnected);
  // }
}
