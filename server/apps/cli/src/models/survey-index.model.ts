import { Model } from "objection";
import { SurveyDimensionModel } from "./survey-dimension.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyItemModel } from "./survey-item.model";

const debug = getDebugger("dim");

export class SurveyIndexModel extends Model {
  id!: number;
  surveyDimension: SurveyDimensionModel;
  useForPredictions: boolean;
  abbreviation: string;
  title: string;

  static tableName = "survey_index";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete survey items");
    await SurveyItemModel.query(transaction)
      .delete()
      .whereIn("surveyIndexId", asFindQuery().select("id"));
  }
}
