import { Model } from "objection";
import { SurveyModel } from "@common/cli/src/models/survey.model";
import { LetterModel } from "@common/cli/src/models/letter.model";
import { LetterTypeModel } from "@common/cli/src/models/letter-type.model";

export class SurveyLetterModel extends Model {
  id!: number;
  survey: SurveyModel;
  letter: LetterModel;
  letterType: LetterTypeModel;

  static tableName = "survey_letter";
}
