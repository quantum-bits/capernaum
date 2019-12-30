import { join } from "path";
import { config } from "dotenv";
config({
  path: join(__dirname, "../../.env")
});

import commander from "commander";
import { table } from "table";
import { QualtricsService } from "../qualtrics/qualtrics.service";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata
} from "../qualtrics/qualtrics.types";
import chalk from "chalk";
import { DateTime } from "luxon";

const program = new commander.Command();
program
  .version("0.0.1")
  .option("-s --start-date", "start date for responses")
  .option("-e --end-date", "end date for responses")
  .option("-v --verbose", "produce verbose output");

const qualtricsService = new QualtricsService();

///// Organization

program
  .command("show-org")
  .description("show organization details")
  .action(() => {
    if (process.env.QUALTRICS_ORG_ID) {
      qualtricsService
        .getOrganization(process.env.QUALTRICS_ORG_ID)
        .then(organization => {
          const data = [
            ["Id", organization.id],
            ["Name", organization.name],
            ["Type", organization.type],
            ["Status", organization.status]
          ];
          const options = {
            drawHorizontalLine: (index: number, size: number) => {
              return index === 0 || index === size;
            }
          };
          console.log(table(data, options));
        })
        .catch(err => console.error(err));
    } else {
      throw new Error("No organization ID");
    }
  });

///// Surveys

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

// Compare a and b and return -1, 0, or 1.
const compareDateTimes = (a: DateTime, b: DateTime) =>
  a < b ? -1 : a > b ? 1 : 0;

program
  .command("list-surveys [by-date]")
  .description("list all surveys")
  .action((byDate: boolean) => {
    qualtricsService.listSurveys().then((surveyList: QualtricsSurveyList) => {
      const elements: SortableMetadata[] = surveyList.elements.map(element => ({
        lastModified: DateTime.fromISO(element.lastModified),
        metadata: element
      }));

      const headers = ["Id", "Name", "Last Modified"].map(hdr =>
        chalk.greenBright(hdr)
      );
      const data = [[...headers]];

      const sortFn = (a: SortableMetadata, b: SortableMetadata) =>
        byDate
          ? compareDateTimes(a.lastModified, b.lastModified)
          : a.metadata.name.localeCompare(b.metadata.name);

      elements.sort(sortFn).map(elt => {
        data.push([
          elt.metadata.id,
          elt.metadata.name,
          elt.lastModified.toISODate()
        ]);
      });
      console.log(table(data));
    });
  });

program
  .command("get-survey <survey-id>")
  .description("get a single survey")
  .action(surveyId => {
    qualtricsService.getSurvey(surveyId).then(survey => {
      if (program.verbose) {
        console.log(JSON.stringify(survey, null, 2));
      } else {
        console.log(survey.name);
      }
    });
  });

///// Responses

program
  .command("create-response-export <survey-id>")
  .description("create a response")
  .action(surveyId => {
    qualtricsService
      .createResponseExport(surveyId, program.startDate, program.endDate)
      .then(response => console.log(JSON.stringify(response, null, 2)))
      .catch(err => console.error(err));
  });

program
  .command("check-export-progress <survey-id> <progress-id>")
  .description("Check export progress")
  .action((surveyId, progressId) => {
    qualtricsService
      .getResponseExportProgress(surveyId, progressId)
      .then(progress => console.log(JSON.stringify(progress, null, 2)))
      .catch(err => console.error(err));
  });

program
  .command("get-export-file <survey-id> <file-id>")
  .description("get response export file")
  .action((surveyId, fileId) => {
    qualtricsService
      .getResponseExportFile(surveyId, fileId)
      .then(entries => {
        return entries.map(entry => ({
          fileName: entry.fileName,
          content: JSON.parse(entry.content)
        }));
      })
      .then(result => console.log(JSON.stringify(result, null, 2)))
      .catch(err => console.error(err));
  });

program
  .command("get-all-responses <survey-id>")
  .description("list responses to a survey (optional date range)")
  .action(surveyId => {
    qualtricsService
      .getResponses(surveyId, program.startDate, program.endDate)
      .then(response => response[0].content)
      .then(zipFileEntry => JSON.parse(zipFileEntry))
      .then(jsonData => console.log(JSON.stringify(jsonData, null, 2)))
      .catch(err => console.error(err));
  });

///// Subscriptions

program
  .command("create-subscription <publicationUrl> <eventName> [surveyId]")
  .description("create event subscription")
  .action((publicationUrl: string, eventName: string, surveyId?: string) => {
    qualtricsService
      .createSubscription(publicationUrl, eventName, surveyId)
      .then(response => console.log("RESPONSE", response))
      .catch(err => console.log("ERROR", err));
  });

program
  .command("list-subscriptions")
  .description("list all event subscriptions")
  .action(() => {
    qualtricsService
      .listSubscriptions()
      .then(response => console.log(response))
      .catch(err => console.log(err));
  });

program
  .command("delete-subscription <subscriptionId>")
  .description("delete an event subscription")
  .action((subscriptionId: string) => {
    qualtricsService
      .deleteSubscription(subscriptionId)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  });

program
  .command("get-subscription <subscriptionId>")
  .description("get one event subscription")
  .action((subscriptionId: string) => {
    qualtricsService
      .getSubscription(subscriptionId)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  });

// Error on unknown commands; see the commander documentation
program.on("command:*", function() {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

program.parse(process.argv);
