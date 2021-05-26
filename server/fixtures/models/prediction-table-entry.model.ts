import { LetterModel } from "./letter.model";
import { Model } from "objection";
import { SurveyIndexModel } from "./survey-index.model";
import { ScriptureEngagementPracticeModel } from "./scripture-engagement-practice.model";

export class PredictionTableEntryModel extends Model {
  id!: number;
  letter: LetterModel;
  surveyIndex: SurveyIndexModel;
  practice: ScriptureEngagementPracticeModel;
  sequence: number;

  static tableName = "prediction_table_entry";
}
