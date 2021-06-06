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
  SurveyLetter,
  SurveyLetterCreateInput,
  SurveyLetterUpdateInput,
  SurveyResponse,
  SurveyUpdateInput,
} from "./entities";
import { SurveyLetterService, SurveyService } from "./survey.service";
import { Int } from "@nestjs/graphql";
import { WhichItems } from "./survey.types";
import { PredictionTableEntry } from "../prediction/entities";
import { Letter } from "../letter/entities";
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
    return this.surveyService.createSurvey(createInput);
  }

  @Mutation(() => SurveyDimension, {
    description: "Create a survey dimension.",
  })
  createSurveyDimension(
    @Args("createInput") createInput: SurveyDimensionCreateInput
  ) {
    return this.surveyService.createDimension(createInput);
  }

  @Mutation(() => SurveyIndex, {
    description:
      "Create a survey index. Can add survey items directly by item ID.",
  })
  createSurveyIndex(@Args("createInput") createInput: SurveyIndexCreateInput) {
    return this.surveyService.createIndex(createInput);
  }

  @Query(() => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(Survey, id);
  }

  @Query(() => [Survey])
  surveys() {
    return this.surveyService.find(Survey);
  }

  @Query(() => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query(() => [SurveyIndex])
  surveyIndices() {
    return this.surveyService.find(SurveyIndex);
  }

  @Query(() => [SurveyItem], {
    description: "Retrieve all survey items",
  })
  surveyItems() {
    return this.surveyService.find(SurveyItem);
  }

  @Mutation(() => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.update(Survey, updateInput);
  }

  @Mutation(() => SurveyDimension)
  updateSurveyDimension(
    @Args("updateInput") updateInput: SurveyDimensionUpdateInput
  ) {
    return this.surveyService.update(SurveyDimension, updateInput);
  }

  @Mutation(() => SurveyIndex, {
    description: `Update an index. Field values will replaces existing values in the object.
      (e.g., if you give a value for itemIds, it will replace the current list.`,
  })
  updateSurveyIndex(@Args("updateInput") updateInput: SurveyIndexUpdateInput) {
    return this.surveyService.updateSurveyIndex(updateInput);
  }

  @Mutation(() => Int)
  deleteSurvey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurvey(id);
  }

  @Mutation(() => SurveyDimensionDeleteOutput, {
    description: `Delete a dimension. Also deletes indices associated with this dimension.
    Each index is removed using the equivalent of deleteSurveyIndex.
    Returns details of everything that was deleted.`,
  })
  deleteSurveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyDimension(id);
  }

  @Mutation(() => SurveyIndexDeleteOutput, {
    description:
      "Delete an index. Also removes associations with items; the items are not removed.",
  })
  deleteSurveyIndex(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyIndex(id);
  }

  @Mutation(() => Int, {
    description: "Delete a survey response",
  })
  deleteSurveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.deleteSurveyResponse(id);
  }

  @ResolveField("letters", () => [Letter], {
    description: "Fetch the letters for this survey",
  })
  resolveLetters(@Parent() survey: Survey) {
    return this.surveyService.find(Letter, { surveyId: survey.id });
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
    return this.surveyService.findItemsForSurvey(survey, whichItems);
  }

  @ResolveField("surveyDimensions", () => [SurveyDimension], {
    description:
      "Dimensions for this survey; groups indices, which group items.",
  })
  resolveSurveyDimensions(@Parent() survey: Survey) {
    return this.surveyService.find(SurveyDimension, { survey });
  }

  @ResolveField("surveyResponses", () => [SurveyResponse], {
    description: "Responses for this survey",
  })
  resolveSurveyResponses(@Parent() survey: Survey) {
    return this.surveyService.find(SurveyResponse, { survey });
  }

  @ResolveField("groups", () => [Group], {
    description: "Groups using this survey",
  })
  resolveGroups(@Parent() survey: Survey) {
    return this.surveyService.find(Group, { survey });
  }
}

@Resolver(() => SurveyResponse)
export class SurveyResponseResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => SurveyResponse)
  surveyResponse(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.surveyResponse(id);
  }

  @Query(() => [SurveyResponse])
  surveyResponses(
    @Args("groupId", {
      type: () => Int,
      nullable: true,
      description: "Limit to one group",
    })
    groupId?: number
  ) {
    return this.surveyService.readSurveyResponses(groupId);
  }

  @ResolveField("survey", () => Survey)
  resolveSurvey(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.findOneOrFail(Survey, surveyResponse.surveyId);
  }

  @ResolveField("surveyItemResponses", () => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyResponse: SurveyResponse) {
    return this.surveyService.find(SurveyItemResponse, { surveyResponse });
  }
}

@Resolver(() => SurveyItemResponse)
export class SurveyItemResponseResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField("surveyItem", () => SurveyItem)
  resolveSurveyItem(@Parent() surveyItemResponse: SurveyItemResponse) {
    return this.surveyService.findOneOrFail(
      SurveyItem,
      surveyItemResponse.surveyItemId
    );
  }
}

@Resolver(() => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.find(SurveyDimension);
  }

  @Query(() => SurveyDimension)
  surveyDimension(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.findOne(SurveyDimension, id);
  }

  @Query(() => SurveyDimension)
  updateSurveyDimension(updateInput: SurveyDimensionUpdateInput) {
    return this.surveyService.update(SurveyDimension, updateInput);
  }

  @ResolveField(() => Survey)
  survey(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.findOne(Survey, surveyDimension.surveyId);
  }

  @ResolveField(() => [SurveyIndex], {
    description: "List of survey index entries for this dimension.",
  })
  surveyIndices(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.find(SurveyIndex, { surveyDimension });
  }
}

@Resolver(() => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField(() => [SurveyItem], {
    description: "List of survey items for this index",
  })
  surveyItems(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(SurveyItem, { surveyIndex });
  }

  @ResolveField(() => SurveyDimension)
  surveyDimension(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.findOne(
      SurveyDimension,
      surveyIndex.surveyDimensionId
    );
  }

  @ResolveField(() => [PredictionTableEntry])
  predictionTableEntries(@Parent() surveyIndex: SurveyIndex) {
    return this.surveyService.find(PredictionTableEntry, { surveyIndex });
  }
}

@Resolver(() => SurveyItem)
export class SurveyItemResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveField(() => SurveyIndex, {
    description: "Index associated with this item (if any)",
  })
  surveyIndex(@Parent() surveyItem: SurveyItem) {
    if (surveyItem && surveyItem.surveyIndexId) {
      return this.surveyService.findOne(SurveyIndex, surveyItem.surveyIndexId);
    } else {
      return null;
    }
  }

  @ResolveField("surveyItemResponses", () => [SurveyItemResponse])
  resolveSurveyItemResponses(@Parent() surveyItem: SurveyItem) {
    return this.surveyService.find(SurveyItemResponse, { surveyItem });
  }

  @ResolveField("surveyItemResponse", () => SurveyItemResponse, {
    nullable: true,
  })
  resolveSurveyItemResponse(
    @Parent() surveyItem: SurveyItem,
    @Args({ name: "responseId", type: () => Int }) responseId: number
  ) {
    return this.surveyService.findItemResponse(surveyItem, responseId);
  }
}

@Resolver("SurveyLetter")
export class SurveyLetterResolver {
  constructor(private readonly surveyletterService: SurveyLetterService) {}

  @Mutation(() => SurveyLetter)
  createSurveyLetter(
    @Args("createInput") createInput: SurveyLetterCreateInput
  ) {
    return this.surveyletterService.createSurveyLetter(createInput);
  }

  @Query(() => [SurveyLetter])
  readSurveyLetters() {
    return this.surveyletterService.readSurveyLetters();
  }

  @Mutation(() => SurveyLetter)
  updateSurveyLetter(
    @Args("updateInput") updateInput: SurveyLetterUpdateInput
  ) {
    return this.surveyletterService.updateSurveyLetter(updateInput);
  }

  @Mutation(() => Int)
  deleteSurveyLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyletterService.deleteSurveyLetter(id);
  }
}
