import { getDebugger } from "@helpers/debug-factory";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import pluralize from "pluralize";
import { ReportService } from "@reporter/src/report/report.service";
import { GroupService } from "@server/src/group/group.service";

const debug = getDebugger("reporter");

@Injectable()
export class CronDaemon {
  private readonly logger = new Logger(CronDaemon.name);

  constructor(
    private readonly reportService: ReportService,
    private readonly groupService: GroupService
  ) {}

  @Cron(process.env.CRON_TIME)
  async maybeProcessGroupReport() {
    debug("Check for groups ready to report");

    const readyGroups = await this.groupService.findReadyForReport();
    debug("Ready groups %O", readyGroups);
    this.logger.log(
      `${readyGroups.length} ${pluralize(
        "group",
        readyGroups.length
      )} ready to report`
    );

    for (const group of readyGroups) {
      await this.reportService.processGroupReport(group.id);
    }
  }
}
