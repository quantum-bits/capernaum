import NestContext from "@common/cli/src/nest-helpers";
import { printPretty } from "@helpers/formatting";
import { ReportService } from "@reporter/src/queue/report.service";

export async function queueReportRequest(
  qualtricsSurveyId: string,
  qualtricsResponseId: string
) {
  const nestContext = new NestContext();
  const reportService = await nestContext.get(ReportService);
  const job = await reportService.requestIndividualReport(
    qualtricsSurveyId,
    qualtricsResponseId
  );
  await nestContext.close();

  printPretty(job);
}
