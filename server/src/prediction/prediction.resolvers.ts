import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import {
  PredictionTable,
  PredictionTableCreateInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput
} from "./entities";
import { PredictionService } from "./prediction.service";

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
}
