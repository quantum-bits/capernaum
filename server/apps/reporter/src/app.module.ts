import { Module, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ReportQueueConsumerModule } from "./consumer/report-queue-consumer.module";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("app");

@Module({
  imports: [ReportQueueConsumerModule],
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit(): any {
    debug("Called onModuleInit()");
  }
  onApplicationBootstrap(): any {
    debug("Called onApplicationBootstrap()");
  }
}
