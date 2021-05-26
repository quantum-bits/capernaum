import { Model } from "objection";

export class SurveyItemResponseModel extends Model {
  id!: number;
  // surveyResponse: SurveyResponseModel;
  // surveyItem: SurveyItemModel;
  label: string;
  value: number;

  static tableName = "survey_item_response";
}
