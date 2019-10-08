import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableEntry,
  PredictionTableEntryCreateInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput
} from "./entities";
import { PredictionService } from "./prediction.service";
import { SurveyIndex } from "../survey/entities";
import { Int } from "type-graphql";

@Resolver(of => PredictionTable)
export class PredictionTableResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(returns => PredictionTable, {
    description: "Create a prediction table"
  })
  createPredictionTable(
    @Args("createInput") createInput: PredictionTableCreateInput
  ) {
    return this.predictionService.create(PredictionTable, createInput);
  }

  @Query(returns => PredictionTable)
  predictionTable(@Args({ name: "id", type: () => Int }) id: number) {
    return this.predictionService.readOne(PredictionTable, id);
  }

  @Query(returns => [PredictionTable])
  predictionTables() {
    return this.predictionService.readAllPredictionTables();
  }

  @ResolveProperty("entries", type => [PredictionTableEntry])
  resolveEntries(@Parent() table: PredictionTable) {
    return this.predictionService.find(PredictionTableEntry, {
      table
    });
  }
}

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
    return this.predictionService.readOne(ScriptureEngagementPractice, id);
  }

  @Query(returns => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.predictionService.readAllScriptureEngagementPractices();
  }
}
