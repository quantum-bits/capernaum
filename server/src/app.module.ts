import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeORMConfig from "./typeorm-config";
import { LetterModule } from "./letter/letter.module";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UserService } from "./user/user.service";

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
    SurveyModule,
    PredictionModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {}
