import { GluegunCommand, GluegunToolbox } from "gluegun";
import { GroupService } from "@server/src/group/group.service";
import { INestApplicationContext } from "@nestjs/common";
import { GroupModule } from "@server/src/group/group.module";

import Debug from "debug";
const debug = Debug("cli");

export default {
  name: "list",
  alias: ["l"],
  description: "List all groups",
  run: async (toolbox: GluegunToolbox) => {
    const app: INestApplicationContext = await toolbox.getNestApp();
    const groupService: GroupService = app
      .select(GroupModule)
      .get(GroupService, {
        strict: true,
      });

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
    toolbox.print.table(data, { format: "lean" });

    await app.close();
  },
} as GluegunCommand;
