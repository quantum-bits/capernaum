import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@common/common.constants";
import { Job, Queue } from "bull";

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(REPORTER_QUEUE_NAME) private readonly reporterQueue: Queue
  ) {}

  async requestIndividualReport(
    qualtricsSurveyId: string,
    qualtricsResponseId: string
  ): Promise<Job> {
    const details = {
      qualtricsSurveyId,
      qualtricsResponseId,
    };
    const job = await this.reporterQueue.add(details);

    this.logger.debug(
      `Requested report for response ${qualtricsResponseId} to survey ${qualtricsSurveyId}`
    );
    return job;
  }
}
