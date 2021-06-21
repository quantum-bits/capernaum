import { Module } from "@nestjs/common";
import { QueueDaemon } from "@reporter/src/daemon/queue.daemon";
import { GroupModule } from "@server/src/group/group.module";
import { CronDaemon } from "./cron.daemon";
import { ReportModule } from "@reporter/src/report/report.module";

@Module({
  imports: [GroupModule, ReportModule],
  providers: [CronDaemon, QueueDaemon],
  exports: [CronDaemon],
})
export class DaemonModule {}
