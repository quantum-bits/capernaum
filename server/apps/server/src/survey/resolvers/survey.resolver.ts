import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyItem,
  SurveyResponse,
  SurveyUpdateInput,
} from "../entities";
import { SurveyService } from "../services/survey.service";
import { Int } from "@nestjs/graphql";
import { WhichItems } from "../survey.types";
import { Letter } from "../../letter/entities";
import { Group } from "@server/src/group/entities/group";

@Resolver(() => Survey)
// @UseGuards(GqlAuthGuard)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey, {
    description: "Create a new survey.",
    deprecationReason: "Should only create surveys from Qualtrics",
  })
  createSurvey(
    @Args("createInput") createInput: SurveyCreateInput
  ): Promise<Survey> {
    return this.surveyService.construct(createInput);
  }

  @Query(() => [Survey])
  surveys() {
    return this.surveyService.readAll();
  }

  @Query(() => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.readOne(id);
  }

  @Mutation(() => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.update(updateInput);
  }

  @Mutation(() => Int)
  deleteSurvey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deconstruct(id);
  }

  @ResolveField("letters", () => [Letter], {
    description: "Fetch the letters for this survey",
  })
  resolveLetters(@Parent() survey: Survey) {
    return this.surveyService.resolveRelatedLetters(survey);
  }

  @ResolveField("surveyItems", () => [SurveyItem], {
    description: `All the Qualtrics items for this survey; 
    for groupings, see survey dimension and index.
    Pass 'whichItems' to choose which to return (default 'All')`,
  })
  resolveSurveyItems(
    @Parent() survey: Survey,
    @Args({
      name: "whichItems",
      type: () => WhichItems,
      defaultValue: WhichItems.All,
    })
    whichItems: WhichItems
  ) {
    return this.surveyService.resolveRelatedItems(survey, whichItems);
  }

  @ResolveField("surveyDimensions", () => [SurveyDimension], {
    description:
      "Dimensions for this survey; groups indices, which group items.",
  })
  resolveSurveyDimensions(@Parent() survey: Survey) {
    return this.surveyService.resolveRelatedDimensions(survey);
  }

  @ResolveField("surveyResponses", () => [SurveyResponse], {
    description: "Responses for this survey",
  })
  resolveSurveyResponses(@Parent() survey: Survey) {
    return this.surveyService.resolveRelatedResponses(survey);
  }

  @ResolveField("groups", () => [Group], {
    description: "Groups using this survey",
  })
  resolveGroups(@Parent() survey: Survey) {
    return this.surveyService.resolveRelatedGroups(survey);
  }
}
