import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Survey } from "./survey.entities";
import { SurveyResolver } from "./survey.resolvers";
import { SurveyService } from "./survey.service";

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyService, SurveyResolver]
})
export class SurveyModule {}
