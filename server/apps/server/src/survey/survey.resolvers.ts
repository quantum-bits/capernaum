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
  SurveyUpdateInput,
} from "./entities";
import { SurveyService } from "./survey.service";
import { Int } from "@nestjs/graphql";
import { QualtricsResponseImportStats, WhichItems } from "./survey.types";
import { PredictionTableEntry } from "../prediction/entities";
import { Group, Letter } from "../letter/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver((of) => Survey)
// @UseGuards(GqlAuthGuard)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation((returns) => Survey, {
    description: "Create a new survey.",
    deprecationReason: "Should only create surveys from Qualtrics",
  })
  createSurvey(@Args("createInput") createInput: SurveyCreateInput) {
    return this.surveyService.createSurvey(createInput);
  }

  @Mutation((returns) => SurveyDimension, {
    description: "Create a survey dimension.",
  })
  createSurveyDimension(
    @Args("createInput") createInput: SurveyDimensionCreateInput
  ) {
    return this.surveyService.createDimension(createInput);
  }

  @Mutation((returns) => SurveyIndex, {
    description:
      "Create a survey index. Can add survey items directly by item ID.",
  })
  createSurveyIndex(@Args("createInput") createInput: SurveyIndexCreateInput) {
    return this.surveyService.createIndex(createInput);
  }

  @Query((returns) => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(Survey, id);
  }

  @Query((returns) => [Survey])
  surveys() {
    return this.surveyService.find(Survey);
  }

  @Query((returns) => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query((returns) => [SurveyIndex])
  surveyIndices() {
    return this.surveyService.find(SurveyIndex);
  }

  @Query((returns) => [SurveyItem], {
    description: "Retrieve all survey items",
  })
  surveyItems() {
    return this.surveyService.find(SurveyItem);
  }

  @Mutation((returns) => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.update(Survey, updateInput);
  }

  @Mutation((returns) => SurveyDimension)
  updateSurveyDimension(
    @Args("updateInput") updateInput: SurveyDimensionUpdateInput
  ) {
    return this.surveyService.update(SurveyDimension, updateInput);
  }

  @Mutation((returns) => SurveyIndex, {
    description: `Update an index. Field values will replaces existing values in the object.
      (e.g., if you give a value for itemIds, it will replace the current list.`,
  })
  updateSurveyIndex(@Args("updateInput") updateInput: SurveyIndexUpdateInput) {
    return this.surveyService.updateSurveyIndex(updateInput);
  }

  @Mutation((returns) => Int)
  deleteSurvey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurvey(id);
  }

  @Mutation((returns) => SurveyDimensionDeleteOutput, {
    description: `Delete a dimension. Also deletes indices associated with this dimension.
    Each index is removed using the equivalent of deleteSurveyIndex.
    Returns details of everything that was deleted.`,
  })
  deleteSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyDimension(id);
  }

  @Mutation((returns) => SurveyIndexDeleteOutput, {
    description:
      "Delete an index. Also removes associations with items; the items are not removed.",
  })
  deleteSurveyIndex(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyIndex(id);
  }

  @Mutation((returns) => Int, {
    description: "Delete a survey response",
  })
  deleteSurveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyResponse(id);
  }

  @ResolveField("letters", (type) => [Letter], {
    description: "Fetch the letters for this survey",
  })
  resolveLetters(@Parent() survey: Survey) {
    return this.surveyService.find(Letter, { surveyId: survey.id });
  }

  @ResolveField("surveyItems", (type) => [SurveyItem], {
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
    return this.surveyService.findItemsForSurvey(survey, whichItems);
  }

  @ResolveField("surveyDimensions", (type) => [SurveyDimension], {
    description:
      "Dimensions for this survey; groups indices, which group items.",
  })
  resolveSurveyDimensions(@Parent() survey: Survey) {
    return this.surveyService.find(SurveyDimension, { survey });
  }

  @ResolveField("surveyResponses", (type) => [SurveyResponse], {
    description: "Responses for this survey",
  })
  resolveSurveyResponses(@Parent() survey: Survey) {
    return this.surveyService.find(SurveyResponse, { survey });
  }

  @ResolveField("groups", (type) => [Group], {
    description: "Groups using this survey",
  })
  resolveGroups(@Parent() survey: Survey) {
    return this.surveyService.find(Group, { survey });
  }
}

@Resolver((of) => SurveyResponse)
export class SurveyResponseResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query((returns) => SurveyResponse)
  surveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.surveyResponse(id);
  }

  @Query((returns) => [SurveyResponse])
  surveyResponses() {
    return this.surveyService.find(SurveyResponse);
  }

  @ResolveField("survey", (type) => Survey)
  resolveSurvey(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.findOneOrFail(Survey, surveyResponse.surveyId);
  }

  @ResolveField("surveyItemResponses", (type) => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.find(SurveyItemResponse, { surveyResponse });
  }
}

@Resolver((of) => SurveyItemResponse)
export class SurveyItemResponseResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField("surveyItem", (type) => SurveyItem)
  resolveSurveyItem(@Parent() surveyItemResponse: SurveyItemResponse) {
    return this.surveyService.findOneOrFail(
      SurveyItem,
      surveyItemResponse.surveyItemId
    );
  }
}

@Resolver((of) => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query((returns) => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query((returns) => SurveyDimension)
  surveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(SurveyDimension, id);
  }

  @Query((returns) => SurveyDimension)
  updateSurveyDimension(updateInput: SurveyDimensionUpdateInput) {
    return this.surveyService.update(SurveyDimension, updateInput);
  }

  @ResolveField((type) => Survey)
  survey(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.findOne(Survey, surveyDimension.surveyId);
  }

  @ResolveField((type) => [SurveyIndex], {
    description: "List of survey index entries for this dimension.",
  })
  surveyIndices(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.find(SurveyIndex, { surveyDimension });
  }
}

@Resolver((of) => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField((type) => [SurveyItem], {
    description: "List of survey items for this index",
  })
  surveyItems(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(SurveyItem, { surveyIndex });
  }

  @ResolveField((type) => SurveyDimension)
  surveyDimension(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.findOne(
      SurveyDimension,
      surveyIndex.surveyDimensionId
    );
  }

  @ResolveField((type) => [PredictionTableEntry])
  predictionTableEntries(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(PredictionTableEntry, { surveyIndex });
  }
}

@Resolver((of) => SurveyItem)
export class SurveyItemResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField((type) => SurveyIndex, {
    description: "Index associated with this item (if any)",
  })
  surveyIndex(@Parent() surveyItem: SurveyItem) {
    if (surveyItem && surveyItem.surveyIndexId) {
      return this.surveyService.findOne(SurveyIndex, surveyItem.surveyIndexId);
    } else {
      return null;
    }
  }

  @ResolveField("surveyItemResponses", (type) => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyItem: SurveyItem) {
    return this.surveyService.find(SurveyItemResponse, { surveyItem });
  }

  @ResolveField("surveyItemResponse", (type) => SurveyItemResponse, {
    nullable: true,
  })
  resolveSurveyItemResponse(
    @Parent() surveyItem: SurveyItem,
    @Args({ name: "responseId", type: () => Int }) responseId: number
  ) {
    return this.surveyService.findItemResponse(surveyItem, responseId);
  }
}
