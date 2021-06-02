import { GluegunToolbox } from "gluegun";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import { DateTime } from "luxon";
import chalk = require("chalk");
import { QualtricsApiService } from "@qapi/qualtrics-api.service";

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

// Compare a and b and return -1, 0, or 1.
const compareDateTimes = (a: DateTime, b: DateTime) =>
  a < b ? -1 : a > b ? 1 : 0;

export default {
  name: "list",
  alias: ["l"],
  description: "List surveys",
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.info(toolbox.parameters);
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
        toolbox.parameters.options.byDate
          ? compareDateTimes(a.lastModified, b.lastModified)
          : a.metadata.name.localeCompare(b.metadata.name);

      elements.sort(sortFn).forEach((elt) => {
        data.push([
          elt.metadata.id,
          elt.metadata.name,
          elt.lastModified.toISODate(),
        ]);
      });
      toolbox.print.table(data, { format: "lean" });
    });
  },
};
