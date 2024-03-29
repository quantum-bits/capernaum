import { Model } from "objection";
import { GroupTypeModel } from "./group-type.model";
import { SurveyResponseModel } from "./survey-response.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyModel } from "@common/cli/src/models/survey.model";

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
  survey: SurveyModel;

  static tableName = "group";

  static relationMappings = () => ({
    type: {
      modelClass: GroupTypeModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "group.typeId",
        to: "group_type.id",
      },
    },
    survey: {
      modelClass: SurveyModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "group.surveyId",
        to: "survey.id",
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
