import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Survey } from "./survey.entities";
import { SurveyService } from "./survey.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";

@Resolver(of => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(returns => [Survey])
  async surveys() {
    return await this.surveyService.surveys();
  }

  @Query(returns => Survey)
  async survey(@Args({ name: "id", type: () => Int }) id: number) {
    return await this.surveyService.survey(id);
  }

  @Mutation(returns => Int)
  async deleteSurvey(@Args({ name: "id", type: () => Int }) id: number) {
    const result: DeleteResult = await this.surveyService.deleteSurvey(id);
    return result.affected;
  }
}
