import "../../../test/database.helper";
import { Model } from "objection";
import faker from "faker";

class Group extends Model {
  static get tableName() {
    return "group";
  }

  static makeMock() {
    return Group.fromJson({
      name: faker.company.companyName(),
      type: faker.random.arrayElement(["Sunday School", "Small Group"]),
      created: faker.date.recent().toISOString(),
      closedAfter: faker.date.soon(14).toISOString(),
      adminFirstName: faker.name.firstName(),
      adminLastName: faker.name.lastName(),
      adminEmail: faker.internet.email(),
      codeWord: "FIZZY",
      surveyId: 11,
    });
  }
}

test("can retrieve groups from database", async () => {
  const groups = await Group.query().where(true);
  console.log("GROUPS", groups);
  expect(groups).toHaveLength(2);
});

test("can insert a new group into the database", async () => {
  return Group.query().insert(Group.makeMock());
});

afterAll(() => {
  Group.knex().destroy();
});
