import { Model } from "objection";
import { LetterModel } from "./letter.model";
import { LetterElementTypeModel } from "./letter-element-type.model";
import { ImageModel } from "./image.model";
import { SurveyDimensionModel } from "./survey-dimension.model";
import { PredictionTableModel } from "./prediction-table.model";

export class LetterElementModel extends Model {
  id!: number;
  sequence: number;
  textDelta: string;
  image: ImageModel;
  letter: LetterModel;
  letterElementType: LetterElementTypeModel;
  surveyDimension: SurveyDimensionModel;
  predictionTable: PredictionTableModel;

  static tableName = "letter_element";
}
