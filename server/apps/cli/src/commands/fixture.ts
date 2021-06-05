import inquirer, { ChoiceOptions } from "inquirer";
import { enableDebugOutput, getDebugger } from "@helpers/debug-factory";

import { ScriptureEngagementPracticeFixture } from "../fixtures/cls/se-practices.fixture";
import { PredictionEntriesFixture } from "../fixtures/cls/prediction-entries.fixture";
import { SurveyDimensionsFixture } from "../fixtures/cls/survey-dimensions.fixture";
import { LetterElementsFixture } from "../fixtures/cls/letter-elements.fixture";
import { LetterTypesFixture } from "../fixtures/letter-types.fixture";
import { SurveyItemsFixture } from "../fixtures/cls/survey-items.fixture";
import { GroupTypesFixture } from "../fixtures/group-types.fixture";
import { LettersFixture } from "../fixtures/cls/letters.fixture";
import { SurveyIndexesFixture } from "../fixtures/cls/survey-indexes.fixture";
import { ImagesFixture } from "../fixtures/cls/images.fixture";

import {
  fetchQualtricsSurveyMetadata,
  importQualtricsSurvey,
} from "@common/cli/src/commands/survey";
import { SurveyModel } from "@common/cli/src/models/survey.model";

const debug = getDebugger("fixture");

const groupTypesFixture = new GroupTypesFixture();
const imagesFixture = new ImagesFixture();
const letterElementsFixture = new LetterElementsFixture();
const lettersFixture = new LettersFixture();
const letterTypesFixture = new LetterTypesFixture();
const predictionEntriesFixture = new PredictionEntriesFixture();
const sePracticesFixture = new ScriptureEngagementPracticeFixture();
const surveyDimensionsFixture = new SurveyDimensionsFixture();
const surveyIndexesFixture = new SurveyIndexesFixture();
const surveyItemsFixture = new SurveyItemsFixture();

export async function nuclearOption(options) {
  enableDebugOutput("cap:fixture:* cap:model:*");
  debug("options %o", options);

  if (!options.force) {
    // No force flag; prompt the user.
    const reply = await inquirer.prompt([
      {
        type: "confirm",
        name: "nuke",
        message: "Really nuke everything?",
        default: false,
      },
    ]);
    if (!reply.nuke) {
      // Run away!
      return;
    }
  }

  /**
   * Grab surveys from Qualtrics and formulate a list of choices for Inquirer.
   */
  async function getSurveyChoices(): Promise<ChoiceOptions[]> {
    const activeSurveys = await fetchQualtricsSurveyMetadata();
    debug("activeSurveys %O", activeSurveys);
    return activeSurveys.map((survey) => ({
      name: `${survey.name} (${survey.id} of ${survey.lastModified})`,
      value: survey.id,
    }));
  }

  async function promptForSurveyId(): Promise<string> {
    if (options.surveyId) {
      return options.surveyId;
    } else {
      const reply = await inquirer.prompt([
        {
          type: "list",
          name: "surveyId",
          choices: await getSurveyChoices(),
          message: "Which survey would you like to import?",
        },
      ]);
      debug("REPLY %O", reply);
      return reply.surveyId;
    }
  }

  const qualtricsSurveyId = await promptForSurveyId();

  await groupTypesFixture.load();
  await letterTypesFixture.load();
  await imagesFixture.load();
  await sePracticesFixture.load();

  debug("Delete surveys");
  await SurveyModel.query().delete();
  const importedSurvey = await importQualtricsSurvey(qualtricsSurveyId);

  await surveyDimensionsFixture.load({ surveyId: importedSurvey.id });
  await surveyIndexesFixture.load();
  await surveyItemsFixture.load({ surveyId: importedSurvey.id });

  await lettersFixture.load({ surveyId: importedSurvey.id });
  await letterElementsFixture.load();
  await predictionEntriesFixture.load();
}
