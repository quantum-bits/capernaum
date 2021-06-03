import { config } from "dotenv";
config();

import { NestFactory } from "@nestjs/core";
import { CliModule } from "./cli.module";
import { Command } from "commander";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { table } from "table";
import {
  QualtricsSurveyList,
  QualtricsSurveyMetadata,
} from "@qapi/qualtrics-api.types";
import { DateTime } from "luxon";
import chalk = require("chalk");
import { INestApplicationContext } from "@nestjs/common";
import { GroupService } from "@server/src/group/group.service";
import Debug from "debug";

const debug = Debug("cli");

interface SortableMetadata {
  lastModified: DateTime;
  metadata: QualtricsSurveyMetadata;
}

// Compare a and b and return -1, 0, or 1.
const compareDateTimes = (a: DateTime, b: DateTime) =>
  a < b ? -1 : a > b ? 1 : 0;

function listSurveys() {
  const qualtricsService = new QualtricsApiService();
  const byDate = false;

  qualtricsService.listSurveys().then((surveyList: QualtricsSurveyList) => {
    const elements: SortableMetadata[] = surveyList.elements.map((element) => ({
      lastModified: DateTime.fromISO(element.lastModified),
      metadata: element,
    }));

    const headers = ["Id", "Name", "Last Modified"].map((hdr) =>
      chalk.greenBright(hdr)
    );
    const data = [[...headers]];

    const sortFn = (a: SortableMetadata, b: SortableMetadata) =>
      byDate
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

function showOrg() {
  const qualtricsService = new QualtricsApiService();

  if (process.env.QUALTRICS_ORG_ID) {
    qualtricsService
      .getOrganization(process.env.QUALTRICS_ORG_ID)
      .then((organization) => {
        const data = [
          ["Id", organization.id],
          ["Name", organization.name],
          ["Type", organization.type],
          ["Status", organization.status],
        ];
        const options = {
          drawHorizontalLine: (index: number, size: number) => {
            return index === 0 || index === size;
          },
        };
        console.log(table(data, options));
      })
      .catch((error) => console.error(error));
  } else {
    throw new Error("No organization ID");
  }
}

async function listGroups() {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(CliModule);
  const groupService: GroupService = app.get(GroupService);

  const groups = await groupService.readGroups();
  debug("groups %O", groups);

  const headers = ["ID", "Name", "Admin", "Code"];
  const data = groups.map((grp) => [
    grp.id.toString(),
    grp.name,
    [grp.adminFirstName, grp.adminLastName].join(" "),
    grp.codeWord,
  ]);
  data.unshift(headers);
  console.log(table(data));
  await app.close();
}

const program = new Command();
program.version("0.0.1");

program
  .command("org")
  .description("Qualtrics organization details")
  .action(showOrg);

program
  .command("survey")
  .option("--by-date")
  .description("List all surveys")
  .action(listSurveys);

program.command("group").action(listGroups);

program.parse(process.argv);
