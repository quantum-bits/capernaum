import { Command, flags } from "@oclif/command";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "../../../../server/libs/qualtrics-api";
import { DateTime } from "luxon";
import chalk from "chalk";
import { table } from "table";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

// Compare a and b and return -1, 0, or 1.
const compareDateTimes = (a: DateTime, b: DateTime) =>
  a < b ? -1 : a > b ? 1 : 0;

export default class SurveyList extends Command {
  static description = "list all surveys";

  static flags = {
    "by-date": flags.boolean(),
  };

  async run() {
    const { flags } = this.parse(SurveyList);
    const qualtricsService = new QualtricsApiService();

    qualtricsService.listSurveys().then((surveyList: QualtricsSurveyList) => {
      const elements: SortableMetadata[] = surveyList.elements.map(
        (element) => ({
          lastModified: DateTime.fromISO(element.lastModified),
          metadata: element,
        })
      );

      const headers = ["Id", "Name", "Last Modified"].map((hdr) =>
        chalk.greenBright(hdr)
      );
      const data = [[...headers]];

      const sortFn = (a: SortableMetadata, b: SortableMetadata) =>
        flags["by-date"]
          ? compareDateTimes(a.lastModified, b.lastModified)
          : a.metadata.name.localeCompare(b.metadata.name);

      elements.sort(sortFn).forEach((elt) => {
        data.push([
          elt.metadata.id,
          elt.metadata.name,
          elt.lastModified.toISODate(),
        ]);
      });
      this.log(table(data));
    });
  }
}
