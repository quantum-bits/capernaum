import { DateTime } from "luxon";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import ora from "ora";
import { table } from "table";
import chalk from "chalk";

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

// Compare a and b and return -1, 0, or 1.
const compareDateTimes = (a: DateTime, b: DateTime) =>
  a < b ? -1 : a > b ? 1 : 0;

export function listSurveys(options) {
  const qualtricsService = new QualtricsApiService();
  const spinner = ora("Fetching surveys from Qualtrics").start();

  qualtricsService.listSurveys().then((surveyList: QualtricsSurveyList) => {
    const elements: SortableMetadata[] = surveyList.elements.map((element) => ({
      lastModified: DateTime.fromISO(element.lastModified),
      metadata: element,
    }));
    spinner.stop();

    const headers = ["Id", "Name", "Last Modified"].map((hdr) =>
      chalk.greenBright(hdr)
    );
    const data = [[...headers]];

    const sortFn = (a: SortableMetadata, b: SortableMetadata) =>
      options.byDate
        ? compareDateTimes(a.lastModified, b.lastModified)
        : a.metadata.name.localeCompare(b.metadata.name);

    elements.sort(sortFn).forEach((elt) => {
      data.push([
        elt.metadata.id,
        elt.metadata.name,
        elt.lastModified.toISODate(),
      ]);
    });
    console.log(table(data));
  });
}

export function getSurvey(surveyId: string) {
  const qualtricsService = new QualtricsApiService();

  qualtricsService
    .getSurvey(surveyId)
    .then((survey) => console.log(JSON.stringify(survey)));
}
