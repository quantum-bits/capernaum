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

  @Mutation(returns => Survey, {
    description: "Create a new survey.",
    deprecationReason: "Should only create surveys from Qualtrics"
  })
  createSurvey(@Args("createInput") createInput: SurveyCreateInput) {
    return this.surveyService.createSurvey(createInput);
  }

  @Mutation(returns => SurveyDimension, {
    description: "Create a survey dimension."
  })
  createSurveyDimension(
    @Args("createInput") createInput: SurveyDimensionCreateInput
  ) {
    return this.surveyService.createDimension(createInput);
  }

  @Mutation(returns => SurveyIndex, {
    description:
      "Create a survey index. Can add survey items directly by item ID."
  })
  createSurveyIndex(@Args("createInput") createInput: SurveyIndexCreateInput) {
    return this.surveyService.createIndex(createInput);
  }

  @Query(returns => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.readOneSurvey(id);
  }

  @Query(returns => [Survey])
  surveys() {
    return this.surveyService.readAllSurveys();
  }

  @Query(returns => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.readAllSurveyDimensions();
  }

  @Query(returns => [SurveyIndex])
  surveyIndices() {
    return this.surveyService.readAllSurveyIndices();
  }

  @Query(returns => [SurveyItem], { description: "Retrieve all survey items" })
  surveyItems() {
    return this.surveyService.readAllSurveyItems();
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

  @Mutation(returns => SurveyIndex, {
    description: `Update an index. Field values will replaces existing values in the object.
      (e.g., if you give a value for itemIds, it will replace the current list.`
  })
  updateSurveyIndex(@Args("updateInput") updateInput: SurveyIndexUpdateInput) {
    return this.surveyService.updateSurveyIndex(updateInput);
  }

  @Mutation(returns => SurveyDimensionDeleteOutput, {
    description: `Delete a dimension. Also deletes indices associated with this dimension.
    Each index is removed using the equivalent of deleteSurveyIndex.
    Returns details of everything that was deleted.`
  })
  deleteSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyDimension(id);
  }

  @Mutation(returns => SurveyIndexDeleteOutput, {
    description:
      "Delete an index. Also removes associations with items; the items are not removed."
  })
  deleteSurveyIndex(@Args("id") id: number) {
    return this.surveyService.deleteSurveyIndex(id);
  }

  @ResolveProperty("surveyItems", type => [SurveyItem])
  resolveSurveyItems(@Parent() survey: Survey) {
    console.log(`** Resolve 'surveyItems' for survey ${survey.id}`);
    return this.surveyService.findItemsForSurvey(survey);
  }

  @ResolveProperty("surveyDimensions", type => [SurveyDimension])
  resolveSurveyDimensions(@Parent() survey: Survey) {
    console.log(`** Resolve 'surveyDimensions' for survey ${survey.id}`);
    return this.surveyService.findDimensionsForSurvey(survey);
  }

  @Mutation(returns => Survey, {
    description:
      "Import a survey from Qualtrics. Always use this to create a Capernaum survey."
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

  @ResolveProperty(type => Survey)
  survey(@Parent() surveyDimension: SurveyDimension) {
    console.log(`** Resolve 'survey' for dimension ${surveyDimension.id}`);
    return this.surveyService.readOneSurvey(surveyDimension.surveyId);
  }

  @ResolveProperty(type => [SurveyIndex], {
    description: "List of survey index entries for this dimension."
  })
  surveyIndices(@Parent() surveyDimension: SurveyDimension) {
    console.log(
      `** Resolve 'surveyIndices' for dimension ${surveyDimension.id}`
    );
    return this.surveyService.findIndicesForDimension(surveyDimension);
  }
}

@Resolver(of => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => [SurveyItem], {
    description: "List of survey items for this index"
  })
  surveyItems(@Parent() surveyIndex: SurveyIndex) {
    console.log(`** Resolve 'surveyItems' for survey index ${surveyIndex.id}`);
    return this.surveyService.findItemsForIndex(surveyIndex);
  }

  @ResolveProperty(type => SurveyDimension)
  surveyDimension(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.readOneDimension(surveyIndex.surveyDimensionId);
  }
}
