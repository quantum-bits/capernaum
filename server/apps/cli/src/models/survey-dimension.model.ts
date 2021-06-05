import { Model } from "objection";
import { SurveyModel } from "./survey.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyIndexModel } from "./survey-index.model";

const debug = getDebugger("dim");

export class SurveyDimensionModel extends Model {
  id!: number;
  survey: SurveyModel;
  title: string;
  sequence: number;

  static tableName = "survey_dimension";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete indexes");
    await SurveyIndexModel.query(transaction)
      .delete()
      .whereIn("surveyDimensionId", asFindQuery().select("id"));
  }
}
