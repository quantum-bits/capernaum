import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";

import typeORMConfig from "./typeorm-config";
import { WriterModule } from "./writer/writer.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      logging: false // inDevelopmentMode()
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql",
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req })
    }),
    SurveyModule,
    PredictionModule,
    AuthModule,
    MailModule,
    WriterModule,
    QualtricsModule
  ]
})
export class AppModule {}
