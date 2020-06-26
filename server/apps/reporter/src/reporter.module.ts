import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../common.constants";
import { ReporterConsumer } from "./reporter.consumer";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
  ],
  providers: [ReporterConsumer],
})
export class ReporterModule {}
