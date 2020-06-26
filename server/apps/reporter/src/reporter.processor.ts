import { Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../common.constants";
import { Job } from "bull";

@Processor(REPORTER_QUEUE_NAME)
export class ReporterProcessor {
  private readonly logger = new Logger(ReporterProcessor.name);

  @Process()
  async processReport(job: Job) {
    this.logger.debug(`Processing ${job}`);
    return job.id;
  }
}
