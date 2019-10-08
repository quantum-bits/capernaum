import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveProperty,
  Parent
} from "@nestjs/graphql";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableEntry,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput
} from "./entities";
import { PredictionService } from "./prediction.service";
import { SurveyIndex } from "../survey/entities";

@Resolver(of => PredictionTable)
export class PredictionTableResolver {
  constructor(private readonly predictionService: PredictionService) {}

  @Mutation(returns => PredictionTable, {
    description: "Create a prediction table"
  })
  createPredictionTable(
    @Args("createInput") createInput: PredictionTableCreateInput
  ) {
    return this.predictionService.createPredictionTable(createInput);
  }

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

  @Query(returns => [PredictionTable])
  predictionTables() {
    return this.predictionService.readAllPredictionTables();
  }

  @Query(returns => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.predictionService.readAllScriptureEngagementPractices();
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
