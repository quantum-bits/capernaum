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
  PredictionTableEntryService,
  PredictionTableService,
  ScriptureEngagementPracticeService,
} from "./prediction.service";
import { SurveyIndex } from "../survey/entities";
import { Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver(() => PredictionTableEntry)
@UseGuards(GqlAuthGuard)
export class PredictionTableEntryResolver {
  constructor(
    private readonly predictionTableEntryService: PredictionTableEntryService
  ) {}

  @Mutation(() => PredictionTableEntry)
  createPredictionTableEntry(
    @Args("createInput") createInput: PredictionTableEntryCreateInput
  ) {
    return this.predictionTableEntryService.construct(createInput);
  }

  @Mutation(() => [PredictionTableEntry])
  replacePredictionTableEntries(
    @Args("replaceInput") replaceInput: PredictionTableEntryReplaceInput
  ) {
    return this.predictionTableEntryService.replacePredictionTableEntries(
      replaceInput
    );
  }

  @ResolveField("surveyIndex", () => SurveyIndex)
  resolveSurveyIndex(@Parent() predictionTableEntry: PredictionTableEntry) {
    return this.predictionTableEntryService.resolveSurveyIndex(
      predictionTableEntry
    );
  }

  @ResolveField("practice", () => ScriptureEngagementPractice)
  resolveScriptureEngagementPractice(
    @Parent() predictionTableEntry: PredictionTableEntry
  ) {
    return this.predictionTableEntryService.resolveScriptureEngagementPractice(
      predictionTableEntry
    );
  }
}

@Resolver(() => ScriptureEngagementPractice)
@UseGuards(GqlAuthGuard)
export class ScriptureEngagementPracticeResolver {
  constructor(
    private readonly scriptureEngagementPracticeService: ScriptureEngagementPracticeService
  ) {}

  @Mutation(() => ScriptureEngagementPractice, {
    description: "Create a scripture engagement practice",
  })
  createScriptureEngagementPractice(
    @Args("createInput") createInput: ScriptureEngagementPracticeCreateInput
  ) {
    return this.scriptureEngagementPracticeService.create(createInput);
  }

  @Query(() => ScriptureEngagementPractice)
  scriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.scriptureEngagementPracticeService.readOne(id);
  }

  @Query(() => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.scriptureEngagementPracticeService.readAll();
  }

  @Mutation(() => ScriptureEngagementPractice)
  updateScriptureEngagementPractice(
    @Args("updateData") updateData: ScriptureEngagementPracticeUpdateInput
  ) {
    return this.scriptureEngagementPracticeService.update(updateData);
  }

  @Mutation(() => Int)
  deleteScriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.scriptureEngagementPracticeService.deconstruct(id);
  }

  @ResolveField("predictionTableEntries", () => [PredictionTableEntry])
  resolvePredictionTableEntries(
    @Parent() scriptureEngagementPractice: ScriptureEngagementPractice
  ) {
    return this.scriptureEngagementPracticeService.resolvePredictionTableEntries(
      scriptureEngagementPractice
    );
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
    return this.predictiontableService.create(createInput);
  }

  @Query(() => [PredictionTable])
  readPredictionTables() {
    return this.predictiontableService.readAll();
  }

  @Mutation(() => PredictionTable)
  updatePredictionTable(
    @Args("updateInput") updateInput: PredictionTableUpdateInput
  ) {
    return this.predictiontableService.update(updateInput);
  }

  @Mutation(() => Int)
  deletePredictionTable(@Args({ name: "id", type: () => Int }) id: number) {
    return this.predictiontableService.delete(id);
  }
}
