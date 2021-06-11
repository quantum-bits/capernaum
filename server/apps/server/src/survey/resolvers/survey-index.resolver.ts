import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  SurveyIndex,
  SurveyIndexCreateInput,
  SurveyIndexDeleteOutput,
  SurveyIndexUpdateInput,
} from "../entities";
import { SurveyIndexService } from "../services";

@Resolver(() => SurveyIndex)
export class SurveyIndexResolver {
  constructor(private readonly surveyIndexService: SurveyIndexService) {}

  @Mutation(() => SurveyIndex, {
    description:
      "Create a survey index. Can add survey items directly by item ID.",
  })
  surveyIndexCreate(@Args("createInput") createInput: SurveyIndexCreateInput) {
    return this.surveyIndexService.construct(createInput);
  }

  @Query(() => [SurveyIndex])
  surveyIndexReadAll() {
    return this.surveyIndexService.readAll();
  }

  @Mutation(() => SurveyIndex, {
    description: `Update an index. Field values will replaces existing values in the object.
      (e.g., if you give a value for itemIds, it will replace the current list.)`,
  })
  updateSurveyIndex(@Args("updateInput") updateInput: SurveyIndexUpdateInput) {
    return this.surveyIndexService.update(updateInput);
  }

  @Mutation(() => SurveyIndexDeleteOutput, {
    description:
      "Delete an index. Also removes associations with items; the items are not removed.",
  })
  deleteSurveyIndex(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyIndexService.delete(id);
  }
}
