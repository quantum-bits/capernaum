import { Model } from "objection";
import { SurveyDimensionModel } from "./survey-dimension.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponseModel } from "@common/cli/src/models/survey-response.model";
import { SurveyItemModel } from "@common/cli/src/models/survey-item.model";

const debug = getDebugger("model:survey");

export class SurveyModel extends Model {
  id!: number;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  emailKey: string;
  groupCodeKey: string;
  okayForGroup: boolean;
  detailedDescription: string;
  publicName: string;

  static tableName = "survey";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete survey items");
    await SurveyItemModel.query(transaction)
      .delete()
      .whereIn("surveyId", asFindQuery().select("id"));

    debug("Delete survey dimensions");
    await SurveyDimensionModel.query(transaction)
      .delete()
      .whereIn("surveyId", asFindQuery().select("id"));

    debug("Delete survey responses");
    await SurveyResponseModel.query(transaction)
      .delete()
      .whereIn("surveyId", asFindQuery().select("id"));
  }
}
