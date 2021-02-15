import { Module } from "@nestjs/common";
import { ReportQueueProducer } from "./report-queue-producer";
import { BullModule } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@common/common.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
  ],
  providers: [ReportQueueProducer],
  exports: [ReportQueueProducer],
})
export class ReportQueueProducerModule {}
