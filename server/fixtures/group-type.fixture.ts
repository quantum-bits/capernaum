import { GroupTypeModel } from "./models/group-type.model";
import { AbstractFixture } from "./abstract-fixture";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("group");

export class GroupTypeFixture extends AbstractFixture {
  delete() {
    debug("Deleting group type graph");
    return GroupTypeModel.query().delete();
  }

  insert() {
    debug("Inserting group types");
    return GroupTypeModel.query().insertGraph([
      {
        seq: 5,
        name: "Everyone at a particular church",
        code: "WHOLE_CHURCH",
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
      },
      {
        seq: 100,
        name: "Other",
        code: "OTHER",
      },
    ]);
  }
}
