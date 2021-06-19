import NestContext from "@common/cli/src/nest-helpers";
import { printPretty } from "@helpers/formatting";
import { QueueService } from "@reporter/src/queue/queue.service";

export async function queueReportRequest(
  qualtricsSurveyId: string,
  qualtricsResponseId: string
) {
  const nestContext = new NestContext();
  const reportService = await nestContext.get(QueueService);
  const job = await reportService.requestIndividualReport(
    qualtricsSurveyId,
    qualtricsResponseId
  );
  await nestContext.close();

  printPretty(job);
}
