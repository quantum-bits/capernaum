import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { LetterTypeModel } from "@common/cli/src/models/letter-type.model";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";

const debug = getDebugger("fixture:survey-letters");

export class SurveyLettersFixture extends AbstractFixture {
  delete() {
    debug("Delete survey letters");
    return SurveyLetterModel.query().delete();
  }

  async insert() {
    debug("Insert survey letters");

    const updatedFixture = await this.updateFromTypeModel(
      LetterTypeModel,
      letters,
      "_letterTypeName",
      "letterTypeId"
    );

    return SurveyLetterModel.query().insert(updatedFixture);
  }
}

const letters = [
  {
    letterId: 10,
    surveyId: 38,
    letterTypeId: 56,
    _letterTypeName: "individual",
  },
  {
    letterId: 11,
    surveyId: 38,
    letterTypeId: 56,
    _letterTypeName: "group",
  },
];
