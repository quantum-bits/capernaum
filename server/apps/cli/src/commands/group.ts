import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CliModule } from "@common/cli/src/cli.module";
import { GroupService } from "@server/src/group/group.service";
import { table } from "table";

import Debug from "debug";
const debug = Debug("group");

export async function listGroups() {
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
