import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  QualtricsImportInput,
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionDeleteOutput,
  SurveyDimensionUpdateInput,
  SurveyIndex,
  SurveyIndexCreateInput,
  SurveyIndexDeleteOutput,
  SurveyIndexUpdateInput,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { SurveyService } from "./survey.service";
import { QualtricsService } from "../qualtrics/qualtrics.service";
import { Int } from "type-graphql";

@Resolver(of => Survey)
export class SurveyResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly qualtricsService: QualtricsService
  ) {}

  @Mutation(returns => Survey)
  createSurvey(@Args("createInput") createInput: SurveyCreateInput) {
    return this.surveyService.createSurvey(createInput);
  }

  @Mutation(returns => SurveyDimension)
  createSurveyDimension(
    @Args("createInput") createInput: SurveyDimensionCreateInput
  ) {
    return this.surveyService.createDimension(createInput);
  }

  @Mutation(returns => SurveyIndex)
  createSurveyIndex(@Args("createInput") createInput: SurveyIndexCreateInput) {
    return this.surveyService.createIndex(createInput);
  }

  @Query(returns => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.readOne(id);
  }

  @Query(returns => [Survey])
  surveys() {
    return this.surveyService.readAll();
  }

  @Mutation(returns => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.updateSurvey(updateInput);
  }

  @Mutation(returns => SurveyDimension)
  updateSurveyDimension(
    @Args("updateInput") updateInput: SurveyDimensionUpdateInput
  ) {
    return this.surveyService.updateSurveyDimension(updateInput);
  }

  @Mutation(returns => SurveyIndex)
  updateSurveyIndex(@Args("updateInput") updateInput: SurveyIndexUpdateInput) {
    return this.surveyService.updateSurveyIndex(updateInput);
  }

  @Mutation(returns => SurveyDimensionDeleteOutput)
  deleteSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyDimension(id);
  }

  @Mutation(returns => SurveyIndexDeleteOutput)
  deleteSurveyIndex(@Args("id") id: number) {
    return this.surveyService.deleteSurveyIndex(id);
  }

  @ResolveProperty(type => [SurveyItem])
  surveyItems(@Parent() survey: Survey) {
    return this.surveyService.findItemsForSurvey(survey);
  }

  @ResolveProperty(type => [SurveyDimension])
  surveyDimensions(@Parent() survey: Survey) {
    return this.surveyService.findDimensionsForSurvey(survey);
  }

  @Mutation(returns => Survey, {
    description: "Import a survey from Qualtrics"
  })
  async importQualtricsSurvey(
    @Args("importInput") qualtricsImportInput: QualtricsImportInput
  ) {
    // Fetch the survey with the given ID from the Qualtrics API.
    const qualtricsSurvey = await this.qualtricsService.getSurvey(
      qualtricsImportInput.qualtricsId
    );

    // Import survey into the database.
    return this.surveyService.importQualtricsSurvey(
      qualtricsImportInput,
      qualtricsSurvey
    );
  }
}

@Resolver(of => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => [SurveyIndex])
  surveyIndices(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.findIndicesForDimension(surveyDimension);
  }
}

@Resolver(of => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => [SurveyItem])
  surveyItems(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.findItemsForIndex(surveyIndex);
  }
}
