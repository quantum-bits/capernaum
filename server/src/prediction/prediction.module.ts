import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  PredictionTable,
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "./entities";
import {
  PredictionTableEntryResolver,
  PredictionTableResolver,
  ScriptureEngagementPracticeResolver
} from "./prediction.resolvers";
import { PredictionService } from "./prediction.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PredictionTableEntry,
      PredictionTable,
      ScriptureEngagementPractice
    ])
  ],
  providers: [
    PredictionService,
    PredictionTableResolver,
    PredictionTableEntryResolver,
    ScriptureEngagementPracticeResolver
  ]
})
export class PredictionModule {}
