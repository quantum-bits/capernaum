import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";
import { LetterTypeModel } from "@common/cli/src/models/letter-type.model";

const debug = getDebugger("fixture:survey-letter");

export class SurveyLettersFixture extends AbstractFixture {
  delete() {
    debug("Delete survey letters");
    return SurveyLetterModel.query().delete();
  }

  async insert() {
    debug("Insert survey letters");

    const updatedSurveyLetters = await this.updateFromTypeModel(
      LetterTypeModel,
      surveyLetters,
      "_letterTypeName",
      "letterTypeId"
    );

    return SurveyLetterModel.query().insert(updatedSurveyLetters);
  }
}

const surveyLetters = [
  {
    id: 2,
    surveyId: 38,
    letterId: 10,
    letterTypeId: null,
    _letterTypeName: "individual",
  },
];
