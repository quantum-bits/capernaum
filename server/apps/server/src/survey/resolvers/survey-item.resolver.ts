import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { SurveyIndex, SurveyItem, SurveyItemResponse } from "../entities";
import { SurveyItemService } from "@server/src/survey/services/survey-item.service";

@Resolver(() => SurveyItem)
export class SurveyItemResolver {
  constructor(private readonly surveyItemService: SurveyItemService) {}

  @Query(() => [SurveyItem], { description: "Retrieve all survey items" })
  surveyItemsReadAll() {
    return this.surveyItemService.readAll();
  }

  @ResolveField(() => SurveyIndex, {
    description: "Index associated with this item (if any)",
  })
  surveyIndex(@Parent() surveyItem: SurveyItem) {
    return this.surveyItemService.resolveRelatedSurveyIndex(surveyItem);
  }

  @ResolveField("surveyItemResponses", () => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyItem: SurveyItem) {
    return this.surveyItemService.resolveRelatedSurveyItemResponse(surveyItem);
  }
}
