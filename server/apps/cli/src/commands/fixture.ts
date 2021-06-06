import inquirer from "inquirer";
import { enableDebugOutput, getDebugger } from "@helpers/debug-factory";

import { GroupTypesFixture } from "../fixtures/group-types.fixture";
import { ImagesFixture } from "../fixtures/cls/images.fixture";
import { LetterElementsFixture } from "../fixtures/cls/letter-elements.fixture";
import { LettersFixture } from "../fixtures/cls/letters.fixture";
import { LetterTypesFixture } from "../fixtures/letter-types.fixture";
import { PredictionEntriesFixture } from "../fixtures/cls/prediction-entries.fixture";
import { ScriptureEngagementPracticeFixture } from "../fixtures/cls/se-practices.fixture";
import { SurveyDimensionsFixture } from "../fixtures/cls/survey-dimensions.fixture";
import { SurveyIndexesFixture } from "../fixtures/cls/survey-indexes.fixture";
import { SurveyItemsFixture } from "../fixtures/cls/survey-items.fixture";
import { SurveysFixture } from "../fixtures/cls/surveys.fixture";

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
const surveysFixture = new SurveysFixture();

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

  await groupTypesFixture.load();
  await letterTypesFixture.load();
  await imagesFixture.load();
  await sePracticesFixture.load();

  await surveysFixture.load();
  await surveyDimensionsFixture.load();
  await surveyIndexesFixture.load();
  await surveyItemsFixture.load();

  await lettersFixture.load();
  await letterElementsFixture.load();
  await predictionEntriesFixture.load();
}

// async function replaceSurvey(qualtricsSurveyId) {
//   debug("Delete surveys");
//   await SurveyModel.query().delete();
//
//   debug("Import survey");
//   const importedSurvey = await importQualtricsSurvey(qualtricsSurveyId);
//   const surveyUpdateInput: SurveyUpdateInput = {
//     id: importedSurvey.id,
//     okayForGroup: true,
//     publicName: "Capernaum Test Survey",
//     detailedDescription: "Capernaum test fixture survey",
//   };
//   const nestContext = new NestContext();
//   const surveyService = await nestContext.get(SurveyService);
//   await surveyService.updateSurvey(surveyUpdateInput);
//   await nestContext.close();
//
//   return importedSurvey;
// }

// async function promptForSurveyId(): Promise<string> {
//   async function getSurveyChoices(): Promise<ChoiceOptions[]> {
//     const activeSurveys = await fetchQualtricsSurveyMetadata();
//     debug("activeSurveys %O", activeSurveys);
//     return activeSurveys.map((survey) => ({
//       name: `${survey.name} (${survey.id} of ${survey.lastModified})`,
//       value: survey.id,
//     }));
//   }
//
//   if (options.surveyId) {
//     return options.surveyId;
//   } else {
//     const reply = await inquirer.prompt([
//       {
//         type: "list",
//         name: "surveyId",
//         choices: await getSurveyChoices(),
//         message: "Which survey would you like to import?",
//       },
//     ]);
//     debug("REPLY %O", reply);
//     return reply.surveyId;
//   }
// }
