import { Model } from "objection";
import { SurveyDimensionModel } from "./survey-dimension.model";

export class SurveyIndexModel extends Model {
  id!: number;
  surveyDimension: SurveyDimensionModel;
  useForPredictions: boolean;
  abbreviation: string;
  title: string;

  tableName = "survey_index";
}
