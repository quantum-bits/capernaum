import {
  QualtricsSurvey,
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import ora from "ora";
import { table } from "table";
import chalk from "chalk";
import NestContext from "@common/cli/src/nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import { DateTime } from "luxon";
import { Survey } from "@server/src/survey/entities";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";

const debug = getDebugger("survey");

interface ListSurveysOptions {
  byDate: boolean; // Sort by date (instead of name)?
  all: boolean; // Return all surveys (instead of just activeones)?
}

export function fetchQualtricsSurveyMetadata(
  options: ListSurveysOptions = { byDate: true, all: false }
) {
  const qualtricsService = new QualtricsApiService();

  /**
   * Sort by name or by date, depending on the `byDate` option.
   * There's no need to convert the date into (say) a DateTime, because
   * ISO 8601 time stamps already sort lexicographically.
   * @param a
   * @param b
   */
  function sortFn(a: QualtricsSurveyMetadata, b: QualtricsSurveyMetadata) {
    return options.byDate
      ? a.lastModified.localeCompare(b.lastModified)
      : a.name.localeCompare(b.name);
  }

  const spinner = ora("Fetching surveys from Qualtrics").start();
  return qualtricsService
    .listSurveys()
    .then((surveyList: QualtricsSurveyList) => {
      spinner.stop();
      return surveyList.elements
        .sort(sortFn)
        .filter((elt) => elt.isActive || options.all)
        .map((elt) => ({
          ...elt,
          lastModified: DateTime.fromISO(elt.lastModified).toISODate(),
        }));
    });
}

function reportQualtricsSurveyMetadata(surveys: QualtricsSurveyMetadata[]) {
  debug("reportSurveys %O", surveys);

  const headers = ["Id", "Name", "Last Modified", "Active"].map((hdr) =>
    chalk.greenBright(hdr)
  );
  const data = surveys.map((survey) => [
    survey.id,
    survey.name,
    survey.lastModified,
    survey.isActive ? chalk.green("Yes") : "No",
  ]);
  data.unshift(headers);
  console.log(table(data));
}

export async function listSurveys(options: ListSurveysOptions) {
  const surveys = await fetchQualtricsSurveyMetadata(options);
  reportQualtricsSurveyMetadata(surveys);
}

export async function fetchQualtricsSurvey(
  surveyId: string
): Promise<QualtricsSurvey> {
  const qualtricsService = new QualtricsApiService();
  return qualtricsService.getSurvey(surveyId);
}

export function getSurvey(surveyId: string) {
  fetchQualtricsSurvey(surveyId).then((survey) =>
    console.log(JSON.stringify(survey))
  );
}

export async function importQualtricsSurvey(surveyId: string): Promise<Survey> {
  const qualtricsSurvey = await fetchQualtricsSurvey(surveyId);

  const nestContext = new NestContext();
  const qualtricsService = await nestContext.get(QualtricsService);
  const survey = await qualtricsService.importQualtricsSurvey(qualtricsSurvey);
  await nestContext.close();

  return survey;
}

/**
 * Import a survey.
 * @param surveyId ID of survey to import
 */
export async function importSurvey(surveyId: string) {
  console.log(await importQualtricsSurvey(surveyId));
}

// Import survey into the database.
