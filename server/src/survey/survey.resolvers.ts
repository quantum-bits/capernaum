import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Survey, SurveyCreateInput } from "./survey.entities";
import { SurveyService } from "./survey.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";
import { createBaseResolver } from "../generic/generic.resolvers";

/*
@Resolver(of => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(returns => Survey)
  async createSurvey(@Args("input") input: SurveyCreateInput) {
    return await this.surveyService.create(input);
  }

  @Query(returns => [Survey])
  async surveys() {
    return await this.surveyService.readAll();
  }

  @Query(returns => Survey)
  async survey(@Args({ name: "id", type: () => Int }) id: number) {
    return await this.surveyService.readOne(id);
  }

  @Mutation(returns => Int)
  async deleteSurvey(@Args({ name: "id", type: () => Int }) id: number) {
    const result: DeleteResult = await this.surveyService.delete(id);
    return result.affected;
  }
}
 */

const SurveyBaseResolver = createBaseResolver("survey", Survey);

@Resolver(of => Survey)
export class SurveyResolver extends SurveyBaseResolver {
  constructor(private readonly surveyService: SurveyService) {
    super(surveyService);
  }
}
