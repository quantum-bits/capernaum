import { GroupService } from "@server/src/group/group.service";
import { Group } from "@server/src/group/entities";
import { table } from "table";
import { SurveyService } from "@server/src/survey/services/survey.service";
import { SurveyResponse } from "@server/src/survey/entities";
import prettyFormat from "pretty-format";
import NestContext from "../nest-helpers";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("group");

export async function listGroups() {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);

  const groups = await groupService.readGroups();
  debug("groups %O", groups);
  await nestContext.close();

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
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);
  const surveyService = await nestContext.get(SurveyService);

  const result = {} as { group: Group; responses: SurveyResponse[] };

  result.group = await groupService.findGroupByCodeWord(codeWord);

  if (options.withResponses) {
    result.responses = await surveyService.readSurveyResponses(result.group.id);
  }

  await nestContext.close();

  console.log(prettyFormat(result));
}
