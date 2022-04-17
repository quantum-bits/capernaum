import { Model } from "objection";
import { SurveyModel } from "./survey.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyIndexModel } from "./survey-index.model";
import { LetterElementModel } from "@common/cli/src/models/letter-element.model";

const debug = getDebugger("model:survey-dim");

export class SurveyDimensionModel extends Model {
  id!: number;
  survey: SurveyModel;
  title: string;
  sequence: number;

  static tableName = "survey_dimension";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete letter elements");
    await LetterElementModel.query(transaction)
      .delete()
      .whereIn("surveyDimensionId", asFindQuery().select("id"));
    debug("Delete survey indexes");
    await SurveyIndexModel.query(transaction)
      .delete()
      .whereIn("surveyDimensionId", asFindQuery().select("id"));
  }
}
