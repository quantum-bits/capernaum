import { Model } from "objection";
import { SurveyModel } from "./survey.model";
import { SurveyIndexModel } from "./survey-index.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyItemResponseModel } from "./survey-item-response.model";

const debug = getDebugger("model:survey-item");

export class SurveyItemModel extends Model {
  id!: number;
  survey: SurveyModel;
  surveyIndex: SurveyIndexModel;
  sequence: number;
  qualtricsId: string;
  qualtricsText: string;

  static tableName = "survey_item";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete survey item responses");
    await SurveyItemResponseModel.query(transaction)
      .delete()
      .whereIn("surveyItemId", asFindQuery().select("id"));
  }
}
