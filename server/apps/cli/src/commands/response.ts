import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import NestContext from "@common/cli/src/nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import prettyFormat from "pretty-format";
import { SurveyResponseService } from "@server/src/survey/services";
import { SurveyAnalyticsService } from "@server/src/survey/services/survey-analytics.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";

const debug = getDebugger("cli:response");

export function getQualtricsResponse(
  surveyId: string,
  responseId: string,
  options
) {
  const qualtricsService = new QualtricsApiService();
  debug("surveyId '%s'", surveyId);
  debug("responseId '%s'", responseId);
  debug("options %o", options);

  if (responseId) {
    qualtricsService
      .getOneResponse(surveyId, responseId)
      .then((response) => console.log(JSON.stringify(response, null, 2)))
      .catch((error) => console.error(error));
  } else {
    qualtricsService
      .getResponses(surveyId, options.startDate, options.endDate)
      .then((response) => response[0].content)
      .then((zipFileEntry) => JSON.parse(zipFileEntry))
      .then((jsonData) => console.log(JSON.stringify(jsonData)))
      .catch((error) => console.error(error));
  }
}

export async function getGroupResponses(groupId: number) {
  const nestContext = new NestContext();
  const surveyResponseService: SurveyResponseService = await nestContext.get(
    SurveyResponseService
  );
  const responses = surveyResponseService.findByGroupId(groupId);
  await nestContext.close();
  console.log(JSON.stringify(responses));
}

/**
 * Import responses for a survey.
 * @param surveyId ID of survey
 */
export async function importSurveyResponses(surveyId: QualtricsID) {
  debug("importSurveyResponses/get survey '%s'", surveyId);
  const nestContext = new NestContext();
  const qualtricsService = await nestContext.get(QualtricsService);
  const result = await qualtricsService.importAllResponsesForQualtricsSurvey(
    surveyId
  );
  await nestContext.close();
  console.log("RESULT", result);
}

export async function calculateDimensions(responseId: number) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const dimensions = await surveyAnalysisService.calculateDimensions(
    responseId
  );
  await nestContext.close();
  console.log(dimensions);
}

export async function summarizeResponse(responseId: number) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const summary = await surveyAnalysisService.summarizeResponse(responseId);
  await nestContext.close();
  console.log(prettyFormat(summary, { highlight: true }));
}

export async function predictEngagement(responseId: string) {
  const nestContext = new NestContext();
  const surveyResponseService = await nestContext.get(SurveyResponseService);
  const surveyAnalyticsService = await nestContext.get(SurveyAnalyticsService);
  const response = await surveyResponseService.readComplete(
    parseInt(responseId)
  );
  debug("response %O", response);
  const prediction =
    surveyAnalyticsService.predictScriptureEngagement(response);
  await nestContext.close();
  console.log(prettyFormat(prediction));
}
