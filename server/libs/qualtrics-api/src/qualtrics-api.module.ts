import { Module } from "@nestjs/common";
import { QualtricsApiService } from "./qualtrics-api.service";

@Module({
  providers: [QualtricsApiService],
  exports: [QualtricsApiService],
})
export class QualtricsApiModule {}
