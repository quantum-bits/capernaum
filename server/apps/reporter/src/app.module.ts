import { Module } from "@nestjs/common";
import { options } from "@server/src/typeorm-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "@server/src/events/entities";
import {
  PredictionTable,
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "@server/src/prediction/entities";
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
import { Image } from "@server/src/image/entities";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { ReportModule } from "@reporter/src/report/report.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
      entities: [
        Event,
        Group,
        GroupType,
        Image,
        Letter,
        LetterElement,
        LetterElementType,
        LetterType,
        PredictionTable,
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
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
    ReportModule,
  ],
  providers: [],
})
export class AppModule {}
