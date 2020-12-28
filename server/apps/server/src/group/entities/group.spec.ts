import faker from "faker";

function fakeGroup() {
  return {
    name: faker.company.companyName(),
    type: faker.random.arrayElement([
      "Sunday School",
      "Small Group",
      "Bible Study",
    ]),
    created: faker.date.recent().toISOString(),
    closedAfter: faker.date.soon(14).toISOString(),
    adminFirstName: faker.name.firstName(),
    adminLastName: faker.name.lastName(),
    adminEmail: faker.internet.email(),
    codeWord: "FIZZY",
    surveyId: 11,
  };
}

test("can add groups to the database", async () => {});
