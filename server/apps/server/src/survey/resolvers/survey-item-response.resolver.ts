import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { SurveyItem, SurveyItemResponse } from "../entities";
import { SurveyItemResponseService } from "../services";

@Resolver(() => SurveyItemResponse)
export class SurveyItemResponseResolver {
  constructor(
    private readonly surveyItemResponseService: SurveyItemResponseService
  ) {}

  @ResolveField("surveyItem", () => SurveyItem)
  resolveSurveyItem(@Parent() surveyItemResponse: SurveyItemResponse) {
    return this.surveyItemResponseService.resolveSurveyItem(surveyItemResponse);
  }
}
