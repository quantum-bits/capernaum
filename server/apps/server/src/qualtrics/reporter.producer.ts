import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "../../../common.constants";
import { Job, Queue } from "bull";

@Injectable()
export class ReporterProducer {
  private readonly logger = new Logger(ReporterProducer.name);

  constructor(@InjectQueue(REPORTER_QUEUE_NAME) private reporterQueue: Queue) {}

  async requestReport(
    qualtricsSurveyId: string,
    qualtricsResponseId: string
  ): Promise<Job> {
    const details = {
      qualtricsSurveyId,
      qualtricsResponseId,
    };
    const job = await this.reporterQueue.add(details);
    this.logger.debug(`Requested report - ${JSON.stringify(details)}`);
    return job;
  }
}