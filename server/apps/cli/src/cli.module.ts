import { Module } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { QualtricsModule } from "@server/src/qualtrics/qualtrics.module";
import { AuthModule } from "@server/src/auth/auth.module";
import { WriterModule } from "@server/src/writer/writer.module";
import { PredictionModule } from "@server/src/prediction/prediction.module";
import { MachineModule } from "@server/src/machine/machine.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { MailModule } from "@server/src/mail/mail.module";
import { options as typeORMConfig } from "@server/src/typeorm-config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
    }),
    // GraphQLModule.forRoot({
    //   autoSchemaFile: "generated-schema.graphql",
    //   installSubscriptionHandlers: true,
    //   context: ({ req }) => ({ req }),
    // }),
    SurveyModule,
    // PredictionModule,
    AuthModule,
    // MailModule,
    // WriterModule,
    QualtricsModule,
    MachineModule,
    // GroupModule,
  ],
})
export class CliModule {}
