import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SurveyResponse } from "../entities";
import { Int } from "@nestjs/graphql";
import { SurveyResponseService } from "@server/src/survey/services/survey-response.service";

@Resolver(() => SurveyResponse)
export class SurveyResponseResolver {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @Query(() => SurveyResponse)
  surveyResponseById(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyResponseService.readOne(id);
  }

  @Query(() => [SurveyResponse])
  surveyResponsesForGroup(
    @Args("groupId", {
      type: () => Int,
      nullable: true,
      description: "Limit to one group",
    })
    groupId?: number
  ) {
    return this.surveyResponseService.findByGroupId(groupId);
  }

  @Mutation(() => Int, {
    description: "Delete a survey response",
  })
  deleteSurveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyResponseService.delete(id);
  }
}
