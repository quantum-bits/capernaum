import { Model } from "objection";
import { SurveyDimensionModel } from "./survey-dimension.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponseModel } from "@common/cli/src/models/survey-response.model";
import { SurveyItemModel } from "@common/cli/src/models/survey-item.model";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";
import { GroupModel } from "@common/cli/src/models/group.model";

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
  groups: GroupModel[];

  static tableName = "survey";

  static relationMappings = () => ({
    groups: {
      modelClass: GroupModel,
      relation: Model.HasManyRelation,
      join: {
        from: "survey.id",
        to: "group.surveyId",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete groups");
    await GroupModel.query(transaction)
      .delete()
      .whereIn("surveyId", asFindQuery().select("id"));

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

    debug("Delete survey letters");
    await SurveyLetterModel.query(transaction)
      .delete()
      .whereIn("surveyId", asFindQuery().select("id"));
  }
}
