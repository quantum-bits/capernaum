import { Command, } from "@oclif/command";
import { GroupService } from "../../../../server/apps/server/src/group/group.service";

export default class GroupList extends Command {
  static description = "list all groups";

  async run() {
    const groupService = new GroupService();
  }
}
