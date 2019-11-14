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
  SurveyItemResponse,
  SurveyResponse,
  SurveyUpdateInput
} from "./entities";
import { SurveyService } from "./survey.service";
import { QualtricsService } from "../qualtrics/qualtrics.service";
import { Int } from "type-graphql";
import { WhichItems } from "./survey.types";
import { PredictionTableEntry } from "../prediction/entities";

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
    return this.surveyService.findOne(Survey, id);
  }

  @Query(returns => [Survey])
  surveys() {
    return this.surveyService.find(Survey);
  }

  @Query(returns => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query(returns => [SurveyIndex])
  surveyIndices() {
    return this.surveyService.find(SurveyIndex);
  }

  @Query(returns => [SurveyItem], { description: "Retrieve all survey items" })
  surveyItems() {
    return this.surveyService.find(SurveyItem);
  }

  @Mutation(returns => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.update(Survey, updateInput);
  }

  @Mutation(returns => SurveyDimension)
  updateSurveyDimension(
    @Args("updateInput") updateInput: SurveyDimensionUpdateInput
  ) {
    return this.surveyService.update(SurveyDimension, updateInput);
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
  deleteSurveyIndex(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyIndex(id);
  }

  @ResolveProperty("surveyItems", type => [SurveyItem], {
    description:
      "Retrieve survey items; pass `whichItems` to choose which to return (default `All`)"
  })
  resolveSurveyItems(
    @Parent() survey: Survey,
    @Args({
      name: "whichItems",
      type: () => WhichItems,
      defaultValue: WhichItems.All
    })
    whichItems: WhichItems
  ) {
    return this.surveyService.findItemsForSurvey(survey, whichItems);
  }

  @ResolveProperty("surveyDimensions", type => [SurveyDimension])
  resolveSurveyDimensions(@Parent() survey: Survey) {
    return this.surveyService.find(SurveyDimension, { survey });
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

@Resolver(of => SurveyResponse)
export class SurveyResponseResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly qualtricsService: QualtricsService
  ) {}

  @Query(returns => SurveyResponse)
  surveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(SurveyResponse, id);
  }

  @Query(returns => [SurveyResponse])
  surveyResponses() {
    return this.surveyService.find(SurveyResponse);
  }

  @ResolveProperty("survey", type => Survey)
  resolveSurvey(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.findOneOrFail(Survey, surveyResponse.surveyId);
  }

  @Mutation(returns => [SurveyResponse], {
    description: "Fetch responses to a survey"
  })
  async importQualtricsSurveyResponses(
    @Args("qualtricsId") qualtricsId: string
  ) {
    const survey = await this.surveyService.find(Survey, { qualtricsId });

    const zipFileEntries = await this.qualtricsService.getResponses(
      qualtricsId
    );
    const allResponses = JSON.parse(zipFileEntries[0].content).responses;

    const responses: SurveyResponse[] = [];
    for (const oneResponse of allResponses) {
      const response = await this.surveyService.importQualtricsSurveyResponse(
        survey[0].id,
        oneResponse
      );
      responses.push(response);
    }

    return responses;
  }

  @ResolveProperty("surveyItemResponses", type => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.find(SurveyItemResponse, { surveyResponse });
  }
}

@Resolver(of => SurveyItemResponse)
export class SurveyItemResponseResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty("surveyItem", type => SurveyItem)
  resolveSurveyItem(@Parent() surveyItemResponse: SurveyItemResponse) {
    return this.surveyService.findOneOrFail(
      SurveyItem,
      surveyItemResponse.surveyItemId
    );
  }
}

@Resolver(of => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(returns => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query(returns => SurveyDimension)
  surveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(SurveyDimension, id);
  }

  @Query(returns => SurveyDimension)
  updateSurveyDimension(updateInput: SurveyDimensionUpdateInput) {
    return this.surveyService.update(SurveyDimension, updateInput);
  }

  @ResolveProperty(type => Survey)
  survey(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.findOne(Survey, surveyDimension.surveyId);
  }

  @ResolveProperty(type => [SurveyIndex], {
    description: "List of survey index entries for this dimension."
  })
  surveyIndices(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.find(SurveyIndex, { surveyDimension });
  }
}

@Resolver(of => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => [SurveyItem], {
    description: "List of survey items for this index"
  })
  surveyItems(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(SurveyItem, { surveyIndex });
  }

  @ResolveProperty(type => SurveyDimension)
  surveyDimension(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.findOne(
      SurveyDimension,
      surveyIndex.surveyDimensionId
    );
  }

  @ResolveProperty("predictionTableEntries", type => [PredictionTableEntry])
  resolvePredictionTableEntries(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(PredictionTableEntry, { surveyIndex });
  }
}

@Resolver(of => SurveyItem)
export class SurveyItemResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => SurveyIndex, {
    description: "Index associated with this item (if any)"
  })
  surveyIndex(@Parent() surveyItem: SurveyItem) {
    if (surveyItem && surveyItem.surveyIndexId) {
      return this.surveyService.findOne(SurveyIndex, surveyItem.surveyIndexId);
    } else {
      return null;
    }
  }
}
