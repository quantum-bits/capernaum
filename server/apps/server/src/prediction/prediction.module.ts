import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PredictionTableEntry, ScriptureEngagementPractice } from "./entities";
import {
  PredictionTableEntryResolver,
  ScriptureEngagementPracticeResolver,
} from "./prediction.resolvers";
import { PredictionTableEntryService } from "./prediction.service";

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
    ScriptureEngagementPracticeResolver,
  ],
})
export class PredictionModule {}
