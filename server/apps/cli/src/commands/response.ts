import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import NestContext from "@common/cli/src/nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponseService } from "@server/src/survey/services";
import {
  SurveyAnalyticsService,
  SurveyRespondentType,
} from "@server/src/survey/services/survey-analytics.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { printPretty, printTable } from "@helpers/formatting";
import * as _ from "lodash";
import chalk from "chalk";
import { Prediction } from "@server/src/survey/survey.types";

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

export async function meanSurveyIndices(
  responseOrGroupId: number,
  respondentType: SurveyRespondentType
) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const msi = await surveyAnalysisService.meanSurveyIndices(
    responseOrGroupId,
    respondentType
  );
  await nestContext.close();

  const caption =
    respondentType === SurveyRespondentType.Individual
      ? `MSI for Response ${responseOrGroupId}`
      : `MSI for Group ${responseOrGroupId}`;

  printTable(
    ["Index", "Mean"],
    _.map(msi, (elt) => [
      elt.surveyIndexTitle,
      Number(elt.meanSurveyIndex).toFixed(2),
    ]),
    { header: { content: caption } }
  );
}

export async function calculateDimensions(
  responseOrGroupId: number,
  respondentType: SurveyRespondentType
) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const dimensions = await surveyAnalysisService.calculateDimensions(
    responseOrGroupId,
    respondentType
  );
  await nestContext.close();
  printPretty(dimensions);
}

export async function summarizeResponse(responseId: number) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const summary = await surveyAnalysisService.summarizeResponse(responseId);
  await nestContext.close();
  printPretty(summary);
}

export async function predictEngagement(
  predictionTableId: number,
  responseOrGroupId: number,
  respondentType: SurveyRespondentType
) {
  const nestContext = new NestContext();
  const surveyAnalyticsService = await nestContext.get(SurveyAnalyticsService);
  const predictions = await surveyAnalyticsService.predictScriptureEngagement(
    predictionTableId,
    responseOrGroupId,
    respondentType
  );
  await nestContext.close();

  reportPrediction(
    predictions,
    `SEP Predictions for response ${responseOrGroupId}`
  );
}

function reportPrediction(predictions: Prediction[], caption) {
  const headers = ["Predict?", "SE Practice", "Survey Index", "MSI"];
  const data = _.flatMap(predictions, (prediction) => {
    return _.map(prediction.details, (detail, idx) => [
      idx === 0
        ? prediction.predict
          ? chalk.green("Yes")
          : chalk.red("No")
        : "",
      idx === 0 ? prediction.practice.title : "",
      detail.surveyIndexTitle,
      Number(detail.meanResponse).toFixed(2),
    ]);
  });
  printTable(headers, data, {
    header: { content: caption },
    columns: [{ alignment: "right" }],
  });
}
