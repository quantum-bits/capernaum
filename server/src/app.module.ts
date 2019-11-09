import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LetterModule } from "./letter/letter.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { SurveyModule } from "./survey/survey.module";
import typeORMConfig from "./typeorm-config";
import { PredictionModule } from "./prediction/prediction.module";
import { ImageModule } from "./image/image.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      logging: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql"
    }),
    LetterModule,
    QualtricsModule,
    SurveyModule,
    PredictionModule,
    ImageModule
  ]
})
export class AppModule {}
