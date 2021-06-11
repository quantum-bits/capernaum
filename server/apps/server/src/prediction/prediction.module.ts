import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PredictionTableEntry, ScriptureEngagementPractice } from "./entities";
import {
  PredictionTableEntryResolver,
  ScriptureEngagementPracticeResolver,
} from "./prediction.resolvers";
import {
  PredictionTableEntryService,
  ScriptureEngagementPracticeService,
} from "./prediction.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PredictionTableEntry,
      ScriptureEngagementPractice,
    ]),
  ],
  providers: [
    PredictionTableEntryService,
    PredictionTableEntryResolver,
    ScriptureEngagementPracticeService,
    ScriptureEngagementPracticeResolver,
  ],
})
export class PredictionModule {}
