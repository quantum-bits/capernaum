import { GroupService } from "@server/src/group/group.service";
import { Group } from "@server/src/group/entities";
import { table } from "table";
import { SurveyResponse } from "@server/src/survey/entities";
import prettyFormat from "pretty-format";
import NestContext from "../nest-helpers";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponseService } from "@server/src/survey/services";

const debug = getDebugger("group");

export async function listGroups() {
  const nestContext = new NestContext();
  const groupService: GroupService = await nestContext.get(GroupService);

  const groups = await groupService.readAll();
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
