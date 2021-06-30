import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScriptureEngagementPractice } from "./entities";
import { ScriptureEngagementPracticeResolver } from "./prediction.resolvers";
import { ScriptureEngagementPracticeService } from "./prediction.service";

@Module({
  imports: [TypeOrmModule.forFeature([ScriptureEngagementPractice])],
  providers: [
    ScriptureEngagementPracticeService,
    ScriptureEngagementPracticeResolver,
  ],
})
export class PredictionModule {}
