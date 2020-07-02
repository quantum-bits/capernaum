import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PredictionTableEntry, ScriptureEngagementPractice } from "./entities";
import {
  PredictionTableEntryResolver,
  ScriptureEngagementPracticeResolver,
} from "./prediction.resolvers";
import { PredictionService } from "./prediction.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PredictionTableEntry,
      ScriptureEngagementPractice,
    ]),
  ],
  providers: [
    PredictionService,
    PredictionTableEntryResolver,
    ScriptureEngagementPracticeResolver,
  ],
})
export class PredictionModule {}
