import { GroupTypeModel } from "../models/group-type.model";
import { AbstractFixture } from "./abstract-fixture";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("fixture:group-type");

export class GroupTypesFixture extends AbstractFixture {
  delete() {
    debug("Delete group types");
    return GroupTypeModel.query().delete();
  }

  insert() {
    debug("Insert groups types");
    return GroupTypeModel.query().insert(groupTypes);
  }
}

const groupTypes = [
  {
    id: 5,
    seq: 5,
    name: "Everyone at a particular church",
    code: "WHOLE_CHURCH",
  },
  {
    id: 10,
    seq: 10,
    name: "Sunday School class",
    code: "SUNDAY_SCHOOL",
  },
  {
    id: 15,
    seq: 15,
    name: "Small group at a church",
    code: "CHURCH_SMALL_GROUP",
  },
  {
    id: 20,
    seq: 20,
    name: "Spiritual life group with people from a variety of churches or not involved with any particular church",
    code: "LIFE_GROUP",
  },
  {
    id: 25,
    seq: 25,
    name: "People from a para-church organization",
    code: "PARA_CHURCH",
  },
  {
    id: 30,
    seq: 30,
    name: "College spiritual life assessment",
    code: "COLLEGE",
  },
  {
    id: 100,
    seq: 100,
    name: "Other",
    code: "OTHER",
  },
];
