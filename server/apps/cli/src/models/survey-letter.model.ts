import { Model } from "objection";

export class SurveyLetterModel extends Model {
  surveyId: number;
  letterId: number;
  letterTypeId: number;

  static tableName = "survey_letter";

  static get idColumn() {
    return ["surveyId", "letterId", "letterTypeId"];
  }
}
