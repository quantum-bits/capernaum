import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeORMConfig from "./typeorm-config";
import { LetterModule } from "./letter/letter.module";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      logging: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql",
      context: ({ req }) => ({ req })
    }),
    LetterModule,
    SurveyModule,
    PredictionModule,
    AuthModule
  ]
})
export class AppModule {}
