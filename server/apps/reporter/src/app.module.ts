import { Module } from "@nestjs/common";
import { ReportQueueConsumerModule } from "./consumer/report-queue-consumer.module";

@Module({
  imports: [ReportQueueConsumerModule],
})
export class AppModule {}
