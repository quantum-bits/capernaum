import { GroupTypeModel } from "./models/group-type.model";
import { AbstractFixture } from "./abstract-fixture";

export class GroupTypeFixture extends AbstractFixture {
  delete() {
    return GroupTypeModel.query().delete();
  }

  insert() {
    return GroupTypeModel.query().insertGraph([
      {
        name: "Other",
        code: "OTHER",
      },
      {
        name: "Spiritual Growth Group (e.g., small group, Sunday School class)",
        code: "SMALL_GROUP",
      },
      {
        name: "College spiritual life assessment",
        code: "COLLEGE",
      },
    ]);
  }
}
