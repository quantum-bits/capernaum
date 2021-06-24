import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import NestContext from "@common/cli/src/nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyAnalyticsService } from "@server/src/survey/services/survey-analytics.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { printPretty, printTable } from "@helpers/formatting";
import * as _ from "lodash";
import chalk from "chalk";
import {
  Dimension,
  Prediction,
  PredictionCount,
  SurveyRespondentType,
} from "@server/src/survey/survey.types";
import { OptionValues } from "commander";
import { TopLevelSpec } from "vega-lite";
import { makeChart } from "@helpers/vega";
import { VisualizationService } from "@server/src/visualization/visualization.service";

const debug = getDebugger("cli");

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
  const msi = await surveyAnalysisService.calculateMeanSurveyIndices(
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

export async function summarizeResponse(responseId: number) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const summary = await surveyAnalysisService.summarizeResponse(responseId);
  await nestContext.close();
  printPretty(summary);
}

export async function calculateDimensions(
  responseOrGroupId: number,
  options: OptionValues,
  respondentType: SurveyRespondentType
) {
  const nestContext = new NestContext();
  const surveyAnalysisService = await nestContext.get(SurveyAnalyticsService);
  const visualizationService = await nestContext.get(VisualizationService);
  const dimensions = await surveyAnalysisService.calculateSurveyDimensions(
    responseOrGroupId,
    respondentType
  );
  await nestContext.close();

  if (options.pdf) {
    if (!options.dimension) {
      throw new Error("Need dimension PK for graphical output");
    }
    const dimension = dimensions.find(
      (dim) => dim.id === parseInt(options.dimension)
    );
    if (!dimension) {
      throw new Error(`Failed to find dimension ${options.dimension}`);
    }
    console.log("DIMENSION", dimension);
    visualizationService.visualizeDimension(dimension, options.pdf);
  }

  reportDimension(
    dimensions,
    `Dimensions for ${
      respondentType === SurveyRespondentType.Individual ? "response" : "group"
    } ${responseOrGroupId}`
  );
}

function reportDimension(dimensions: Dimension[], caption) {
  const headers = ["Dimension", "Index", "MSI"];
  const data = _.flatMap(
    dimensions.sort((a, b) => a.title.localeCompare(b.title)),
    (dimension) => {
      return _.map(dimension.details, (detail, idx) => [
        idx === 0 ? dimension.title : "",
        detail.indexTitle,
        Number(detail.meanSurveyIndex).toFixed(2),
      ]);
    }
  );
  printTable(headers, data, { header: { content: caption } });
}

export async function predictEngagement(
  responseOrGroupId: number,
  respondentType: SurveyRespondentType
) {
  const nestContext = new NestContext();
  const surveyAnalyticsService = await nestContext.get(SurveyAnalyticsService);
  const predictions =
    await surveyAnalyticsService.predictScriptureEngagementPractices(
      responseOrGroupId,
      respondentType
    );
  await nestContext.close();

  reportPrediction(
    predictions,
    `SEP Predictions for ${
      respondentType === SurveyRespondentType.Individual ? "response" : "group"
    } ${responseOrGroupId}`
  );
}

function greenOrRed(condition: boolean, greenValue, redValue = greenValue) {
  return condition ? chalk.green(greenValue) : chalk.red(redValue);
}

function reportPrediction(predictions: Prediction[], caption) {
  const headers = ["Predict?", "SE Practice", "Survey Index", "MSI"];
  const data = _.flatMap(
    predictions.sort((a, b) =>
      a.practice.title.localeCompare(b.practice.title)
    ),
    (prediction) => {
      return _.map(prediction.details, (detail, idx) => [
        idx === 0 ? greenOrRed(prediction.predict, "Yes", "No") : "",
        idx === 0
          ? greenOrRed(prediction.predict, prediction.practice.title)
          : "",
        detail.surveyIndexTitle,
        greenOrRed(
          detail.meanResponse >=
            parseFloat(process.env.SEP_PREDICTION_THRESHOLD),
          Number(detail.meanResponse).toFixed(2)
        ),
      ]);
    }
  );
  printTable(headers, data, {
    header: { content: caption },
    columns: [{ alignment: "right" }],
  });
}

export async function countGroupPredictions(
  groupId: number,
  options: OptionValues
) {
  const nestContext = new NestContext();
  const surveyAnalyticsService = await nestContext.get(SurveyAnalyticsService);
  const visualizationService = await nestContext.get(VisualizationService);
  const predictionCountsIterator =
    await surveyAnalyticsService.countPredictionsPerGroup(groupId);
  await nestContext.close();

  const predictionCounts = Array.from(predictionCountsIterator);
  debug("predictionCounts %O", predictionCounts);

  if (options.pdf) {
    visualizationService.visualizePredictionCounts(
      predictionCounts,
      options.pdf
    );
  }

  const headers = ["ID", "Title", "Count"];
  const data = _.map(predictionCounts, (predictionCount) => [
    predictionCount.practiceId,
    predictionCount.practiceTitle,
    predictionCount.predictCount,
  ]);
  printTable(headers, data);
}
