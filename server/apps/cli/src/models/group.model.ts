import { Model } from "objection";
import { GroupTypeModel } from "./group-type.model";
import { SurveyResponseModel } from "./survey-response.model";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("model:group");

export class GroupModel extends Model {
  id: number;
  name: string;
  closedAfter: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminComments: string;
  plannedInvitees: number;
  codeWord: string;
  created: number;
  type: GroupTypeModel;
  otherTypeName?: string;

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
    debug("Delete survey responses");
    await SurveyResponseModel.query(transaction)
      .delete()
      .whereIn("groupId", asFindQuery().select("id"));
  }
}
