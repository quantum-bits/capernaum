import { Args, Mutation, Resolver } from "@nestjs/graphql";
import {
  Survey,
  SurveyCreateInput,
  SurveyUpdateInput
} from "./entities";
import { SurveyService } from "./survey.service";
import { BaseResolver } from "../base/base.resolver";

@Resolver(of => Survey)
export class SurveyResolver extends BaseResolver(Survey) {
  constructor(private readonly surveyService: SurveyService) {
    super(surveyService);
  }

  @Mutation(returns => Survey)
  createSurvey(
    @Args("createInput")
    createInput: SurveyCreateInput
  ) {
    return this.service.create(createInput);
  }

  @Mutation(returns => Survey)
  updateSurvey(
    @Args("updateInput")
    updateInput: SurveyUpdateInput
  ) {
    return this.service.update(updateInput);
  }
}
