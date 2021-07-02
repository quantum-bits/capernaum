import { importQualtricsSurvey } from "@common/cli/src/commands/qualtrics";
import NestContext from "@common/cli/src/nest-helpers";
import {
  SurveyLetterService,
  SurveyService,
} from "@server/src/survey/services";
import { printPretty, printTable } from "@helpers/formatting";
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

  const headers = ["Survey ID", "Description"];
  const data = _.map(surveys, (survey) => [
    survey.id,
    survey.detailedDescription,
  ]);

  printPretty({ headers, data });
  printTable(headers, data);
}

export async function listSurveyLetters() {
  const nestContext = new NestContext();
  const surveyLetterService = await nestContext.get(SurveyLetterService);
  const surveyLetters = await surveyLetterService.readAll();
  await nestContext.close();

  const headers = ["Survey ID", "Q Name", "Letter ID", "Title", "Type"];
  const data = _.map(surveyLetters, (surveyLetter) => [
    surveyLetter.survey.id,
    surveyLetter.survey.qualtricsName,
    surveyLetter.letter.id,
    surveyLetter.letter.title,
    surveyLetter.letterType.key,
  ]);

  printTable(headers, data, {
    columns: {
      0: { alignment: "right" },
      2: { alignment: "right" },
    },
    drawVerticalLine(idx) {
      return idx === 2 || idx === 4;
    },
  });
}
