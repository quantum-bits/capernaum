import { DateTime } from "luxon";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import ora from "ora";
import { table } from "table";
import chalk from "chalk";
import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CliModule } from "@common/cli/src/cli.module";
import { QualtricsResolver } from "@server/src/qualtrics/qualtrics.resolvers";
import NestContext from "@common/cli/src/nest-helpers";

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

export function listSurveys(options) {
  const qualtricsService = new QualtricsApiService();
  const spinner = ora("Fetching surveys from Qualtrics").start();

  // Compare a and b and return -1, 0, or 1.
  const compareDateTimes = (a: DateTime, b: DateTime) =>
    a < b ? -1 : a > b ? 1 : 0;

  // Sort by name or by date, depending on `byDate` option.
  const sortFn = (a: SortableMetadata, b: SortableMetadata) =>
    options.byDate
      ? compareDateTimes(a.lastModified, b.lastModified)
      : a.metadata.name.localeCompare(b.metadata.name);

  qualtricsService.listSurveys().then((surveyList: QualtricsSurveyList) => {
    const elements: SortableMetadata[] = surveyList.elements.map((element) => ({
      lastModified: DateTime.fromISO(element.lastModified),
      metadata: element,
    }));
    spinner.stop();

    const headers = ["Id", "Name", "Last Modified", "Active"].map((hdr) =>
      chalk.greenBright(hdr)
    );
    const data = [[...headers]];

    elements.sort(sortFn).forEach((elt) => {
      if (elt.metadata.isActive || options.all) {
        data.push([
          elt.metadata.id,
          elt.metadata.name,
          elt.lastModified.toISODate(),
          elt.metadata.isActive ? "Yes" : "No",
        ]);
      }
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

/**
 * Import a survey.
 * @param surveyId ID of survey to import
 */
export async function importSurvey(surveyId: string) {
  const nestContext = new NestContext();
  const qualtricsResolver = await nestContext.get(QualtricsResolver);
  const result = await qualtricsResolver.importQualtricsSurvey(surveyId);
  await nestContext.close();

  console.log("RESULT", result);
}
