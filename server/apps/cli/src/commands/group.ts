import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CliModule } from "@common/cli/src/cli.module";
import { GroupService } from "@server/src/group/group.service";
import { Group } from "@server/src/group/entities";
import { table } from "table";
import Debug from "debug";
import { SurveyService } from "@server/src/survey/survey.service";
import { SurveyResponse } from "@server/src/survey/entities";
import prettyFormat from "pretty-format";

const debug = Debug("group");

export async function listGroups() {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(CliModule);
  const groupService: GroupService = app.get(GroupService);

  const groups = await groupService.readGroups();
  debug("groups %O", groups);
  await app.close();

  const headers = ["ID", "Name", "Admin", "Code"];
  const data = groups.map((grp) => [
    grp.id.toString(),
    grp.name,
    [grp.adminFirstName, grp.adminLastName].join(" "),
    grp.codeWord,
  ]);
  data.unshift(headers);
  console.log(table(data));
}

export async function getGroup(codeWord: string, options) {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(CliModule);
  const groupService: GroupService = app.get(GroupService);
  const surveyService = app.get(SurveyService);

  const result = {} as { group: Group; responses: SurveyResponse[] };

  result.group = await groupService.findGroupByCodeWord(codeWord);

  if (options.withResponses) {
    result.responses = await surveyService.readSurveyResponses(result.group.id);
  }

  await app.close();

  console.log(prettyFormat(result));
}
