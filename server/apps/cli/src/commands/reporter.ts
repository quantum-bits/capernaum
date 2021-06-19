import NestContext from "@common/cli/src/nest-helpers";
import { printPretty } from "@helpers/formatting";
import { QueueService } from "@reporter/src/queue/queue.service";
import { ReportProcessor } from "@reporter/src/report/report.processor";

export async function queueIndividualReport(
  qualtricsSurveyId: string,
  qualtricsResponseId: string
) {
  const nestContext = new NestContext();
  const queueService = await nestContext.get(QueueService);
  const job = await queueService.requestIndividualReport(
    qualtricsSurveyId,
    qualtricsResponseId
  );
  await nestContext.close();

  printPretty(job);
}

export async function sendGroupReport(groupId: number) {
  const nestContext = new NestContext();
  const reportProcessor = await nestContext.get(ReportProcessor);
  await reportProcessor.processGroupReport(groupId);
  await nestContext.close();

  console.log("Complete");
}
