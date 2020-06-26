import { Module } from "@nestjs/common";
import { ReporterService } from "./reporter.service";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../common.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
  ],
  providers: [ReporterService],
})
export class ReporterModule {}
