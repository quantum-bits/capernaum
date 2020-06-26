import { Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../common.constants";
import { Job } from "bull";

@Processor(REPORTER_QUEUE_NAME)
export class ReporterConsumer {
  private readonly logger = new Logger(ReporterConsumer.name);

  @Process()
  async processReport(job: Job) {
    this.logger.debug(`Processing ${JSON.stringify(job, null, 2)}`);
    return job.id;
  }
}