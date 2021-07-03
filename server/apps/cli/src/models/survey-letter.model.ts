import { Model } from "objection";

export class SurveyLetterModel extends Model {
  surveyId: number;
  letterId: number;
  letterTypeId: number;

  static tableName = "survey_letter";
}
