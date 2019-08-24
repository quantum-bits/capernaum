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
import { Int, registerEnumType } from "type-graphql";
import { FindConditions, IsNull, Not } from "typeorm";

// Used to filter which survey items are retrieved for a survey.
enum WhichItems {
  All,
  WithIndex,
  WithoutIndex
}

registerEnumType(WhichItems, {
  name: "WhichItems",
  description:
    "Which items to retrieve: all, those with an index, those without an index"
});

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
    return this.surveyService.readOne(Survey, id);
  }

  @Query(returns => [Survey])
  surveys() {
    return this.surveyService.readAll(Survey);
  }

  @Query(returns => [SurveyDimension])
  surveyDimensions() {
    return this.surveyService.readAll(SurveyDimension);
  }

  @Query(returns => [SurveyIndex])
  surveyIndices() {
    return this.surveyService.readAll(SurveyIndex);
  }

  @Query(returns => [SurveyItem], { description: "Retrieve all survey items" })
  surveyItems() {
    return this.surveyService.readAll(SurveyItem);
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
    /*
    const conditions = {
      where: {
        survey: survey
      },
      order: {
        surveyIndex: "ASC"
      }
    };
*/

    const conditions = { survey };

    switch (whichItems) {
      case WhichItems.All:
        /* NOP */
        break;
      case WhichItems.WithIndex:
        conditions["surveyIndex"] = Not(IsNull());
        break;
      case WhichItems.WithoutIndex:
        conditions["surveyIndex"] = IsNull();
        break;
    }

    console.log("*** CONDITIONS", conditions);

    return this.surveyService.find(SurveyItem, conditions);
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

@Resolver(of => SurveyDimension)
export class SurveyDimensionResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @ResolveProperty(type => Survey)
  survey(@Parent() surveyDimension: SurveyDimension) {
    return this.surveyService.readOne(Survey, surveyDimension.surveyId);
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
    return this.surveyService.readOne(
      SurveyDimension,
      surveyIndex.surveyDimensionId
    );
  }
}