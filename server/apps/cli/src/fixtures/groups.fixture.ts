import { GroupTypeModel } from "../models/group-type.model";
import { AbstractFixture } from "./abstract-fixture";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("fixture:group-type");

export class GroupsFixture extends AbstractFixture {
  delete() {
    debug("Delete group types");
    return GroupTypeModel.query().delete();
  }

  insert() {
    debug("Insert groups and group types");
    return GroupTypeModel.query().insertGraph(
      [
        {
          seq: 5,
          name: "Everyone at a particular church",
          code: "WHOLE_CHURCH",
          groups: [
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
            },
          ],
        },
        {
          seq: 10,
          name: "Sunday School class",
          code: "SUNDAY_SCHOOL",
        },
        {
          seq: 15,
          name: "Small group at a church",
          code: "CHURCH_SMALL_GROUP",
        },
        {
          seq: 20,
          name: "Spiritual life group with people from a variety of churches or not involved with any particular church",
          code: "LIFE_GROUP",
        },
        {
          seq: 25,
          name: "People from a para-church organization",
          code: "PARA_CHURCH",
        },
        {
          seq: 30,
          name: "College spiritual life assessment",
          code: "COLLEGE",
          groups: [
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
            },
          ],
        },
        {
          seq: 100,
          name: "Other",
          code: "OTHER",
          groups: [
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
            },
          ],
        },
      ],
      { allowRefs: true }
    );
  }
}
