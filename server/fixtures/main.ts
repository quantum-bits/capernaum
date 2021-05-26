import { knex } from "./db";
import { GroupTypeFixture } from "./group-type.fixture";
import { LetterTypeFixture } from "./letter-type.fixture";

async function main() {
  await new GroupTypeFixture().load();
  await new LetterTypeFixture().load();
}

main().then(() => knex.destroy());
