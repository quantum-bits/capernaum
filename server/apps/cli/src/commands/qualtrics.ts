import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import {
  QualtricsSurvey,
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import ora from "ora";
import { DateTime } from "luxon";
import chalk from "chalk";
import { table } from "table";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { Survey } from "@server/src/survey/entities";
import NestContext from "@common/cli/src/nest-helpers";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";

interface ListSurveysOptions {
  byDate: boolean; // Sort by date (instead of name)?
  all: boolean; // Return all surveys (instead of just activeones)?
}

function fetchQualtricsSurveyMetadata(
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

export async function listQualtricsSurveys(options: ListSurveysOptions) {
  const surveys = await fetchQualtricsSurveyMetadata(options);
  reportQualtricsSurveyMetadata(surveys);
}

async function fetchQualtricsSurvey(
  surveyId: string
): Promise<QualtricsSurvey> {
  const qualtricsService = new QualtricsApiService();
  return qualtricsService.getSurvey(surveyId);
}

export function getQualtricsSurvey(surveyId: string) {
  fetchQualtricsSurvey(surveyId).then((survey) =>
    console.log(JSON.stringify(survey))
  );
}

export async function importQualtricsSurvey(
  surveyId: QualtricsID
): Promise<Survey> {
  const nestContext = new NestContext();
  const qualtricsService = await nestContext.get(QualtricsService);
  const survey = await qualtricsService.importQualtricsSurvey(surveyId);
  await nestContext.close();

  return survey;
}
