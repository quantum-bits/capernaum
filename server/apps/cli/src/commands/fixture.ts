import { getDebugger } from "@helpers/debug-factory";
import { ScriptureEngagementPracticeFixture } from "../fixtures/cls/se-practices.fixture";
import { PredictionEntriesFixture } from "../fixtures/cls/prediction-entries.fixture";
import { SurveyDimensionsFixture } from "../fixtures/cls/survey-dimensions.fixture";
import { LetterElementsFixture } from "../fixtures/cls/letter-elements.fixture";
import { LetterTypeFixture } from "../fixtures/letter-type.fixture";
import { SurveyItemsFixture } from "../fixtures/cls/survey-items.fixture";
import { GroupTypeFixture } from "../fixtures/group-type.fixture";
import { LettersFixture } from "../fixtures/cls/letters.fixture";
import { SurveyIndexesFixture } from "../fixtures/cls/survey-indexes.fixture";
import { ImagesFixture } from "../fixtures/cls/images.fixture";

const debug = getDebugger("fixture");

export async function simpleFixture() {
  await new GroupTypeFixture().load();
  await new LetterTypeFixture().load();
}

async function fixture() {
  debug("Load fixtures");
  await new GroupTypeFixture().load();
  await new LetterTypeFixture().load();

  await new ScriptureEngagementPracticeFixture().load();
  await new ImagesFixture().load();

  // --- OKAY ---

  await new SurveyDimensionsFixture().load();
  await new SurveyIndexesFixture().load();
  await new SurveyItemsFixture().load();
  await new LettersFixture().load();
  await new LetterElementsFixture().load();
  await new PredictionEntriesFixture().load();
}
