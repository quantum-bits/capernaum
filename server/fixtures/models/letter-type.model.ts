import { Model } from "objection";
import { LetterElementTypeModel } from "./letter-element-type.model";
import { LetterModel } from "./letter.model";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("letter");

export class LetterTypeModel extends Model {
  id!: number;
  key: string;
  description: string;
  elementTypes: LetterElementTypeModel[];

  static tableName = "letter_type";

  static relationMappings = () => ({
    elementTypes: {
      modelClass: LetterElementTypeModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: "letter_type.id",
        through: {
          from: "letter_type_letter_element_type.letterTypeId",
          to: "letter_type_letter_element_type.letterElementTypeId",
        },
        to: "letter_element_type.id",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Un-relate letter element types");
    await LetterTypeModel.relatedQuery("elementTypes", transaction)
      .for(await asFindQuery().select("id"))
      .unrelate();

    debug("Delete letter models");
    await LetterModel.query(transaction)
      .delete()
      .whereIn("letterTypeId", asFindQuery().select("id"));
  }
}
