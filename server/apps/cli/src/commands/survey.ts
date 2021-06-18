import { importQualtricsSurvey } from "@common/cli/src/commands/qualtrics";
import NestContext from "@common/cli/src/nest-helpers";
import { SurveyService } from "@server/src/survey/services";
import { printPretty } from "@helpers/formatting";
import * as _ from "lodash";

/**
 * Import a survey.
 * @param surveyId ID of survey to import
 */
export async function importSurvey(surveyId: string) {
  console.log(await importQualtricsSurvey(surveyId));
}

export async function listSurveys() {
  const nestContext = new NestContext();
  const surveyService = await nestContext.get(SurveyService);
  const surveys = await surveyService.readAll();
  await nestContext.close();

  printPretty(surveys);

  const headers = [
    "Survey ID",
    "Description",
    "Letter ID",
    "Type",
    "Description",
  ];
  const data = _.flatMap(surveys, (survey) =>
    _.map(survey.surveyLetters, (letter) => [letter.id])
  );
}
