import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  PredictionTableEntry,
  PredictionTableEntryCreateInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput
} from "./entities";
import { PredictionService } from "./prediction.service";
import { SurveyIndex } from "../survey/entities";
import { Int } from "type-graphql";

@Resolver(of => PredictionTableEntry)
export class PredictionTableEntryResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(returns => PredictionTableEntry)
  createPredictionTableEntry(
    @Args("createInput") createInput: PredictionTableEntryCreateInput
  ) {
    return this.predictionService.create(PredictionTableEntry, createInput);
  }

  @ResolveProperty("surveyIndex", type => SurveyIndex)
  resolveSurveyIndex(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionService.findOneOrFail(
      SurveyIndex,
      predictionTableEntry.surveyIndexId
    );
  }

  @ResolveProperty("practice", type => ScriptureEngagementPractice)
  resolveScriptureEngagementPractice(
    @Parent() predictionTableEntry: PredictionTableEntry
  ) {
    return this.predictionService.findOneOrFail(
      ScriptureEngagementPractice,
      predictionTableEntry.practiceId
    );
  }
}

@Resolver(of => ScriptureEngagementPractice)
export class ScriptureEngagementPracticeResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(returns => ScriptureEngagementPractice, {
    description: "Create a scripture engagement practice"
  })
  createScriptureEngagementPractice(
    @Args("createInput") createInput: ScriptureEngagementPracticeCreateInput
  ) {
    return this.predictionService.createScriptureEngagementPractice(
      createInput
    );
  }

  @Query(returns => ScriptureEngagementPractice)
  scriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.predictionService.findOne(ScriptureEngagementPractice, id);
  }

  @Query(returns => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.predictionService.find(ScriptureEngagementPractice);
  }
}
