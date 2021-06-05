import { knex } from "./db";
import { GroupTypeFixture } from "./group-type.fixture";
import { LetterTypeFixture } from "./letter-type.fixture";
import { ScriptureEngagementPracticeFixture } from "./cls/se-practices.fixture";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyDimensionsFixture } from "./cls/survey-dimensions.fixture";
import { SurveyIndexesFixture } from "./cls/survey-indexes.fixture";
import { LettersFixture } from "./cls/letters.fixture";
import { LetterElementsFixture } from "./cls/letter-elements.fixture";
import { ImagesFixture } from "./cls/images.fixture";
import { PredictionEntriesFixture } from "./cls/prediction-entries.fixture";
import { SurveyItemsFixture } from "./cls/survey-items.fixture";

const debug = getDebugger("fixture");

async function main() {
  debug("Loading fixtures");
  // await new GroupTypeFixture().load();
  // await new LetterTypeFixture().load();
  // await new ScriptureEngagementPracticeFixture().load();
  // await new SurveyDimensionsFixture().load();
  // await new SurveyIndexesFixture().load();
  await new SurveyItemsFixture().load();
  // await new ImagesFixture().load();
  // await new LettersFixture().load();
  // await new LetterElementsFixture().load();
  // await new PredictionEntriesFixture().load();
  debug("Done loading");
}

main().then(() => knex.destroy());
