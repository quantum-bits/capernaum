import { QualtricsApiService } from "@qapi/qualtrics-api.service";

import Debug from "debug";
import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CliModule } from "@common/cli/src/cli.module";
import { GroupService } from "@server/src/group/group.service";
import { SurveyService } from "@server/src/survey/survey.service";
import { QualtricsResolver } from "@server/src/qualtrics/qualtrics.resolvers";
const debug = Debug("response");

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
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(CliModule);
  const surveyService: SurveyService = app.get(SurveyService);
  const responses = surveyService.readSurveyResponses(groupId);
  await app.close();

  console.log(JSON.stringify(responses));
}

/**
 * Import responses for a survey.
 * @param surveyId ID of survey
 */
export async function importSurveyResponses(surveyId: string) {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(CliModule);
  const qualtricsResolver = app.get(QualtricsResolver);
  const result = await qualtricsResolver.importQualtricsSurveyResponses(
    surveyId
  );
  await app.close();

  console.log("RESULT", result);
}
