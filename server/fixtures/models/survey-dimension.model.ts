import { Model } from "objection";
import { SurveyModel } from "./survey.model";

export class SurveyDimensionModel extends Model {
  id!: number;
  survey: SurveyModel;
  title: string;
  sequence: number;

  static tableName = "survey_dimension";
}
