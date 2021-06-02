import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { GraphQLModule } from "@nestjs/graphql";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { AuthModule } from "@server/src/auth/auth.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { PredictionModule } from "@server/src/prediction/prediction.module";
import { MachineModule } from "@server/src/machine/machine.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { MailModule } from "@server/src/mail/mail.module";
import { options as typeORMConfig } from "@server/src/typeorm-config";
import { User, UserRole } from "@server/src/user/entities";
import { Machine } from "@server/src/machine/entities";
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
import { Event } from "@server/src/events/entities";
import { Image } from "@server/src/image/entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      logging: "all",
      entities: [
        // Event,
        Group,
        GroupType,
        Image,
        Letter,
        LetterType,
        LetterElement,
        LetterElementType,
        // Machine,
        PredictionTableEntry,
        ScriptureEngagementPractice,
        Survey,
        SurveyDimension,
        SurveyIndex,
        SurveyItem,
        SurveyItemResponse,
        SurveyResponse,
        // User,
        // UserRole,
      ],
    }),
    // GraphQLModule.forRoot({
    //   autoSchemaFile: "generated-schema.graphql",
    //   installSubscriptionHandlers: true,
    //   context: ({ req }) => ({ req }),
    // }),
    // SurveyModule,
    // PredictionModule,
    // AuthModule,
    // MailModule,
    // WriterModule,
    // QualtricsModule,
    // MachineModule,
    GroupModule,
  ],
})
export class CliModule {}
