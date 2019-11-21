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
  ScriptureEngagementPracticeCreateInput,
  PredictionTableEntryReplaceInput,
  ScriptureEngagementPracticeUpdateInput
} from "./entities";
import { PredictionService } from "./prediction.service";
import { SurveyIndex } from "../survey/entities";
import { Int } from "type-graphql";
import { Letter, LetterUpdateInput } from "../letter/entities";

@Resolver(of => PredictionTableEntry)
export class PredictionTableEntryResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(returns => PredictionTableEntry)
  createPredictionTableEntry(
    @Args("createInput") createInput: PredictionTableEntryCreateInput
  ) {
    return this.predictionService.create(PredictionTableEntry, createInput);
  }

  @Mutation(returns => [PredictionTableEntry])
  replacePredictionTableEntries(
    @Args("replaceInput") replaceInput: PredictionTableEntryReplaceInput
  ) {
    return this.predictionService.replacePredictionTableEntries(replaceInput);
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
    if (predictionTableEntry.practice) {
      // console.log("Already have practice");
      return predictionTableEntry.practice;
    } else {
      return this.predictionService.findOneOrFail(
        ScriptureEngagementPractice,
        predictionTableEntry.practiceId
      );
    }
  }

  @ResolveProperty("letter", type => Letter)
  resolveLetter(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionService.findOneOrFail(
      Letter,
      predictionTableEntry.letterId
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
    return this.predictionService.create(
      ScriptureEngagementPractice,
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

  @Mutation(returns => ScriptureEngagementPractice)
  updateScriptureEngagementPractice(
    @Args("updateData") updateData: ScriptureEngagementPracticeUpdateInput
  ) {
    return this.predictionService.update(
      ScriptureEngagementPractice,
      updateData
    );
  }

  @Mutation(returns => Int)
  deleteScriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.predictionService.delete(ScriptureEngagementPractice, id);
  }

  @ResolveProperty("predictionTableEntries", type => [PredictionTableEntry])
  resolvePredictionTableEntries(
    @Parent() scriptureEngagementPractice: ScriptureEngagementPractice
  ) {
    return this.predictionService.find(PredictionTableEntry, {
      practiceId: scriptureEngagementPractice.id
    });
  }
}
