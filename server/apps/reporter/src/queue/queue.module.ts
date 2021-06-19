import { Module } from "@nestjs/common";

import { REPORTER_QUEUE_NAME } from "@common/common.constants";
import { QueueService } from "@reporter/src/queue/queue.service";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPORTER_QUEUE_NAME,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
