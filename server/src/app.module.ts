import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LetterModule } from "./letter/letter.module";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { AuthModule } from "./auth/auth.module";
import { inDevelopmentMode } from "./shared/helpers";
import { MailModule } from "./mail/mail.module";

import typeORMConfig from "./typeorm-config";
import { EventModule } from "./events/event.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      logging: inDevelopmentMode()
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql",
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req })
    }),
    LetterModule,
    SurveyModule,
    PredictionModule,
    AuthModule,
    MailModule,
    EventModule
  ]
})
export class AppModule {}
