import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { SurveyItemService, SurveyService } from "./survey.service";
import { BaseResolver } from "../base/base.resolver";
import { Int, ResolverInterface } from "type-graphql";

@Resolver(of => Survey)
//  implements ResolverInterface<Survey> {
export class SurveyResolver extends BaseResolver(Survey) {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly surveyItemService: SurveyItemService
  ) {
    super(surveyService);
  }

  @Mutation(returns => Survey)
  createSurvey(
    @Args("createInput")
    createInput: SurveyCreateInput
  ) {
    return this.surveyService.create(createInput);
  }

  @Mutation(returns => Survey)
  updateSurvey(
    @Args("updateInput")
    updateInput: SurveyUpdateInput
  ) {
    return this.surveyService.update(updateInput);
  }

  @ResolveProperty(type => [SurveyItem])
  surveyItems(@Parent() survey) {
    return this.surveyItemService.readBySurvey(survey);
  }
}
