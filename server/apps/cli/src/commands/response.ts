import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { SurveyService } from "@server/src/survey/survey.service";
import { QualtricsResolver } from "@server/src/qualtrics/qualtrics.resolvers";
import NestContext from "@common/cli/src/nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import prettyFormat from "pretty-format";

const debug = getDebugger("response");

export function getResponse(surveyId: string, responseId: string, options) {
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
  const surveyService: SurveyService = await nestContext.get(SurveyService);
  const responses = surveyService.readSurveyResponses(groupId);
  await nestContext.close();
  console.log(JSON.stringify(responses));
}

/**
 * Import responses for a survey.
 * @param surveyId ID of survey
 */
export async function importSurveyResponses(surveyId: string) {
  const nestContext = new NestContext();
  const qualtricsResolver = await nestContext.get(QualtricsResolver);
  const result = await qualtricsResolver.importQualtricsSurveyResponses(
    surveyId
  );
  await nestContext.close();
  console.log("RESULT", result);
}

export async function predictEngagement(responseId: string) {
  const nestContext = new NestContext();
  const surveyService = await nestContext.get(SurveyService);
  const response = await surveyService.surveyResponseComplete(
    parseInt(responseId)
  );
  debug("response %O", response);
  const prediction = response.predictScriptureEngagement();
  await nestContext.close();
  console.log(prettyFormat(prediction));
}
