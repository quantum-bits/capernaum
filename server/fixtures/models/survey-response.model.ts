import { Model } from "objection";
import { GroupModel } from "./group.model";
import { SurveyItemResponseModel } from "./survey-item-response.model";

export class SurveyResponseModel extends Model {
  id!: number;
  email: string;
  qualtricsResponseId: string;
  startDate: string;
  endDate: string;
  recordedDate: string;
  status: number;
  progress: number;
  duration: number;
  finished: number;
  ipAddress: string;
  latitude: string;
  longitude: string;
  group: GroupModel;

  static tableName = "survey_response";

  static relationMappings = () => ({
    group: {
      modelClass: GroupModel,
      relation: Model.HasOneRelation,
      join: {
        from: "survey_response.groupId",
        to: "group.id",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    await SurveyItemResponseModel.query(transaction)
      .delete()
      .whereIn("surveyResponseId", asFindQuery().select("id"));
  }
}
