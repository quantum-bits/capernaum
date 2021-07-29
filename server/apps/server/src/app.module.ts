import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { options as typeORMConfig } from "./typeorm-config";
import { WriterModule } from "./writer/writer.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { MachineModule } from "./machine/machine.module";
import { GroupModule } from "./group/group.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      retryAttempts: 3,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql",
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req }),
    }),
    SurveyModule,
    PredictionModule,
    AuthModule,
    MailModule,
    WriterModule,
    QualtricsModule,
    MachineModule,
    GroupModule,
  ],
})
export class AppModule {}
