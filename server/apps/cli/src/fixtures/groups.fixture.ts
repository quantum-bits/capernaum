import { AbstractFixture } from "./abstract-fixture";
import { getDebugger } from "@helpers/debug-factory";
import { GroupModel } from "@common/cli/src/models/group.model";

const debug = getDebugger("fixture:group");

export class GroupsFixture extends AbstractFixture {
  delete() {
    debug("Delete groups");
    return GroupModel.query().delete();
  }

  insert() {
    debug("Insert groups");
    return GroupModel.query().insertGraph(groupGraph, { relate: true });
  }
}

const groupGraph = [
  {
    id: 7,
    name: "Group of Seven",
    codeWord: "GROUP07",
    adminFirstName: "Fred",
    adminLastName: "Ziffle",
    adminEmail: "fredz@example.com",
    adminComments: "Join our group of seven!",
    closedAfter: "2029-09-29",
    plannedInvitees: 7,
    type: {
      id: 10,
    },
    survey: {
      id: 38,
    },
  },
  {
    id: 17,
    name: "Group of Seventeen",
    codeWord: "GROUP17",
    adminFirstName: "Zelda",
    adminLastName: "Ziffle",
    adminEmail: "zz@example.com",
    adminComments: "Join our group of seventeen!",
    closedAfter: "2027-07-17",
    plannedInvitees: 17,
    type: {
      id: 20,
    },
    survey: {
      id: 38,
    },
  },
  {
    id: 1,
    name: "Group of One",
    codeWord: "GROUP01",
    adminFirstName: "Gene",
    adminLastName: "Poole",
    adminEmail: "dna@example.com",
    adminComments: "Is a group of one really a group?",
    otherTypeName: "Singular Group",
    closedAfter: "2027-01-01",
    plannedInvitees: 1,
    type: {
      id: 100,
    },
    survey: {
      id: 38,
    },
  },
];
