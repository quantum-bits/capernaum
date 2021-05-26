import { Model } from "objection";
import { LetterModel } from "./letter.model";
import { LetterElementTypeModel } from "./letter-element-type.model";

export class LetterElementModel extends Model {
  id!: number;
  sequence: number;
  textDelta: string;
  // image: Image;
  letter: LetterModel;
  letterElementType: LetterElementTypeModel;
  //surveyDimension: SurveyDimension;

  static tableName = "letter_element";
}
