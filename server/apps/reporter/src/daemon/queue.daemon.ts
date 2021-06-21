import { Process, Processor } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@common/common.constants";
import { Job } from "bull";
import { getDebugger } from "@helpers/debug-factory";
import { ReportService } from "@reporter/src/report/report.service";

const debug = getDebugger("reporter");

@Processor(REPORTER_QUEUE_NAME)
export class QueueDaemon {
  constructor(private readonly reportService: ReportService) {}

  @Process()
  async processIndividualReport(job: Job) {
    debug("Processing job %O", job);
    await this.reportService.processIndividualReport(
      job.data.qualtricsSurveyId,
      job.data.qualtricsResponseId
    );
  }
}
