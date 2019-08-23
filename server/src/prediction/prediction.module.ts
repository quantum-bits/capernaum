import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  PredictionTable,
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "./entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PredictionTableEntry,
      PredictionTable,
      ScriptureEngagementPractice
    ])
  ],
  providers: []
})
export class PredictionModule {}
