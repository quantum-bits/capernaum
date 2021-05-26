import { Model } from "objection";
import { GroupTypeModel } from "./group-type.model";
import { SurveyResponseModel } from "./survey-response.model";

export class GroupModel extends Model {
  id: number;
  name: string;
  closedAfter: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  codeWord: string;
  created: number;
  type: GroupTypeModel;
  otherTypeName: string;

  static tableName = "group";

  static relationMappings = () => ({
    type: {
      modelClass: GroupTypeModel,
      relation: Model.HasOneRelation,
      join: {
        from: "group.typeId",
        to: "group_type.id",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    await SurveyResponseModel.query(transaction)
      .delete()
      .whereIn("groupId", asFindQuery().select("id"));
  }
}
