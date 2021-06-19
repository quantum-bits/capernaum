import { GroupService } from "@server/src/group/group.service";
import { Group } from "@server/src/group/entities";
import { SurveyResponse } from "@server/src/survey/entities";
import prettyFormat from "pretty-format";
import NestContext from "../nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponseService } from "@server/src/survey/services";
import { printTable } from "@helpers/formatting";
import { DateTime } from "luxon";
import { UpdateResult } from "typeorm";

const debug = getDebugger("group");

export async function listGroups(options) {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);
  let groups: Group[];
  if (options.open) {
    groups = await groupService.findOpen();
  } else if (options.ready) {
    groups = await groupService.findReadyForReport();
  } else {
    groups = await groupService.readAll();
  }
  debug("groups %O", groups);
  await nestContext.close();

  const headers = [
    "ID",
    "Name",
    "Admin",
    "Email",
    "Code",
    "Close Date",
    "Days Remain",
    "Sent Report",
  ];
  const data = groups.map((grp) => [
    grp.id.toString(),
    grp.name,
    [grp.adminFirstName, grp.adminLastName].join(" "),
    grp.adminEmail,
    grp.codeWord,
    DateTime.fromJSDate(grp.closedAfter).toISODate(),
    grp.daysRemaining,
    grp.reportSent ? DateTime.fromJSDate(grp.reportSent).toISODate() : "--",
  ]);
  printTable(headers, data, {
    columns: {
      0: { alignment: "right" },
      6: { alignment: "right" },
    },
  });
}

export async function getGroup(codeWord: string, options) {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);
  const surveyResponseService = await nestContext.get(SurveyResponseService);

  const result = {} as { group: Group; responses: SurveyResponse[] };

  result.group = await groupService.findByCodeWord(codeWord);

  if (options.withResponses) {
    result.responses = await surveyResponseService.findByGroupId(
      result.group.id
    );
  }

  await nestContext.close();

  console.log(prettyFormat(result));
}

function reportUpdateResult(pk: number, result: UpdateResult) {
  if (result.affected === 1) {
    console.log(`Updated ${pk}`);
  } else {
    console.error(`Expected 1 row, affected ${result.affected}`);
  }
}

export async function closeGroup(groupId: number) {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);
  const result = await groupService.closeGroup(groupId);
  await nestContext.close();
  reportUpdateResult(groupId, result);
}

export async function forceGroupReport(groupId: number) {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);
  const result = await groupService.forceReport(groupId);
  await nestContext.close();
  reportUpdateResult(groupId, result);
}
