import { QualtricsService } from "./qualtrics.service";
import { QualtricsResolver } from "./qualtrics.resolvers";
import { Module } from "@nestjs/common";

@Module({
  providers: [QualtricsResolver, QualtricsService],
  exports: [QualtricsService]
})
export class QualtricsModule {}
