import { Model } from "objection";
import { GroupModel } from "./group.model";

export class GroupTypeModel extends Model {
  id: number;
  name: string;
  code: string;
  seq: number;
  groups: GroupModel[];

  static tableName = "group_type";

  static relationMappings = () => ({
    groups: {
      modelClass: GroupModel,
      relation: Model.HasManyRelation,
      join: {
        from: "group_type.id",
        to: "group.typeId",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    await GroupModel.query(transaction)
      .delete()
      .whereIn("typeId", asFindQuery().select("id"));
  }
}
