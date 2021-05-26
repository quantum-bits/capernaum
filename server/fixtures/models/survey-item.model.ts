import { Model } from "objection";
import { SurveyModel } from "./survey.model";
import { SurveyIndexModel } from "./survey-index.model";

export class SurveyItemModel extends Model {
  id!: number;
  survey: SurveyModel;
  surveyIndex: SurveyIndexModel;
  sequence: number;
  qualtricsId: string;
  qualtricsText: string;

  static tableName = "survey_item";
}
