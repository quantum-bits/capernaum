import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  PredictionTableEntry,
  PredictionTableEntryCreateInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  PredictionTableEntryReplaceInput,
  ScriptureEngagementPracticeUpdateInput,
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableUpdateInput,
} from "./entities";
import {
  PredictionService,
  PredictionTableService,
} from "./prediction.service";
import { SurveyIndex } from "../survey/entities";
import { Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver(() => PredictionTableEntry)
@UseGuards(GqlAuthGuard)
export class PredictionTableEntryResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(() => PredictionTableEntry)
  createPredictionTableEntry(
    @Args("createInput") createInput: PredictionTableEntryCreateInput
  ) {
    return this.predictionService.create(PredictionTableEntry, createInput);
  }

  @Mutation(() => [PredictionTableEntry])
  replacePredictionTableEntries(
    @Args("replaceInput") replaceInput: PredictionTableEntryReplaceInput
  ) {
    return this.predictionService.replacePredictionTableEntries(replaceInput);
  }

  @ResolveField("surveyIndex", () => SurveyIndex)
  resolveSurveyIndex(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionService.findOneOrFail(
      SurveyIndex,
      predictionTableEntry.surveyIndexId
    );
  }

  @ResolveField("practice", () => ScriptureEngagementPractice)
  resolveScriptureEngagementPractice(
    @Parent() predictionTableEntry: PredictionTableEntry
  ) {
    return this.predictionService.findOneOrFail(
      ScriptureEngagementPractice,
      predictionTableEntry.practiceId
    );
  }
}

@Resolver(() => ScriptureEngagementPractice)
@UseGuards(GqlAuthGuard)
export class ScriptureEngagementPracticeResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(() => ScriptureEngagementPractice, {
    description: "Create a scripture engagement practice",
  })
  createScriptureEngagementPractice(
    @Args("createInput") createInput: ScriptureEngagementPracticeCreateInput
  ) {
    return this.predictionService.create(
      ScriptureEngagementPractice,
      createInput
    );
  }

  @Query(() => ScriptureEngagementPractice)
  scriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.predictionService.findOne(ScriptureEngagementPractice, id);
  }

  @Query(() => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.predictionService.find(ScriptureEngagementPractice);
  }

  @Mutation(() => ScriptureEngagementPractice)
  updateScriptureEngagementPractice(
    @Args("updateData") updateData: ScriptureEngagementPracticeUpdateInput
  ) {
    return this.predictionService.update(
      ScriptureEngagementPractice,
      updateData
    );
  }

  @Mutation(() => Int)
  deleteScriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.predictionService.delete(ScriptureEngagementPractice, id);
  }

  @ResolveField("predictionTableEntries", () => [PredictionTableEntry])
  resolvePredictionTableEntries(
    @Parent() scriptureEngagementPractice: ScriptureEngagementPractice
  ) {
    return this.predictionService.find(PredictionTableEntry, {
      practiceId: scriptureEngagementPractice.id,
    });
  }
}

@Resolver("PredictionTable")
export class PredictionTableResolver {
  constructor(
    private readonly predictiontableService: PredictionTableService
  ) {}

  @Mutation(() => PredictionTable)
  createPredictionTable(
    @Args("createInput") createInput: PredictionTableCreateInput
  ) {
    return this.predictiontableService.createPredictionTable(createInput);
  }

  @Query(() => [PredictionTable])
  readPredictionTables() {
    return this.predictiontableService.readPredictionTables();
  }

  @Mutation(() => PredictionTable)
  updatePredictionTable(
    @Args("updateInput") updateInput: PredictionTableUpdateInput
  ) {
    return this.predictiontableService.updatePredictionTable(updateInput);
  }

  @Mutation(() => Int)
  deletePredictionTable(@Args({ name: "id", type: () => Int }) id: number) {
    return this.predictiontableService.deletePredictionTable(id);
  }
}
