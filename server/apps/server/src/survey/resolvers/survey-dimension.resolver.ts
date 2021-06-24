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
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionDeleteOutput,
  SurveyDimensionUpdateInput,
  SurveyIndex,
} from "../entities";
import { SurveyDimensionService } from "../services";
import { Int } from "@nestjs/graphql";

@Resolver(() => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(
    private readonly surveyDimensionService: SurveyDimensionService
  ) {}

  @Mutation(() => SurveyDimension, {
    description: "Create a survey dimension.",
  })
  createSurveyDimension(
    @Args("createInput") createInput: SurveyDimensionCreateInput
  ) {
    return this.surveyDimensionService.construct(createInput);
  }

  @Query(() => [SurveyDimension])
  readAllSurveyDimensions() {
    return this.surveyDimensionService.readAll();
  }

  @Query(() => SurveyDimension)
  readOneSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyDimensionService.readOne(id);
  }

  @Mutation(() => SurveyDimension, {
    description: "Update an existing survey dimension",
  })
  updateSurveyDimension(
    @Args("updateInput") updateInput: SurveyDimensionUpdateInput
  ) {
    return this.surveyDimensionService.update(updateInput);
  }

  @Mutation(() => SurveyDimensionDeleteOutput, {
    description: `Delete a dimension. Also deletes indices associated with this dimension.
    Each index is removed using the equivalent of deleteSurveyIndex.
    Returns details of everything that was deleted.`,
  })
  deleteSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyDimensionService.delete(id);
  }

  @ResolveField("survey", () => Survey)
  private resolveSurvey(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyDimensionService.resolveRelatedSurvey(surveyDimension);
  }

  @ResolveField("surveyIndices", () => [SurveyIndex])
  private resolveSurveyIndices(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyDimensionService.resolveRelatedIndices(surveyDimension);
  }
}
