import { LetterModel } from "./letter.model";
import { Model } from "objection";

export class PredictionTableEntryModel extends Model {
  id!: number;
  letter: LetterModel;
  // surveyIndex: SurveyIndexModel;
  // practice: PracticeModel;
  sequence: number;

  static tableName = "prediction_table_entry";
}
