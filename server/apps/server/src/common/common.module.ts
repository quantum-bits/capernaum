import { Module } from "@nestjs/common";
import { LoggingPlugin } from "@server/src/common/logging.plugin";

@Module({
  providers: [LoggingPlugin],
})
export class CommonModule {}
