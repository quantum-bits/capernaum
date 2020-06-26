import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
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
import { Int } from "@nestjs/graphql";
import { Letter, LetterUpdateInput } from "../letter/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver(of => PredictionTableEntry)
@UseGuards(GqlAuthGuard)
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

  @ResolveField("surveyIndex", type => SurveyIndex)
  resolveSurveyIndex(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionService.findOneOrFail(
      SurveyIndex,
      predictionTableEntry.surveyIndexId
    );
  }

  @ResolveField("practice", type => ScriptureEngagementPractice)
  resolveScriptureEngagementPractice(
    @Parent() predictionTableEntry: PredictionTableEntry
  ) {
    return this.predictionService.findOneOrFail(
      ScriptureEngagementPractice,
      predictionTableEntry.practiceId
    );
  }

  @ResolveField("letter", type => Letter)
  resolveLetter(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionService.findOneOrFail(
      Letter,
      predictionTableEntry.letterId
    );
  }
}

@Resolver(of => ScriptureEngagementPractice)
@UseGuards(GqlAuthGuard)
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

  @ResolveField("predictionTableEntries", type => [PredictionTableEntry])
  resolvePredictionTableEntries(
    @Parent() scriptureEngagementPractice: ScriptureEngagementPractice
  ) {
    return this.predictionService.find(PredictionTableEntry, {
      practiceId: scriptureEngagementPractice.id
    });
  }
}