import { Model } from "objection";
import { LetterElementTypeModel } from "./letter-element-type.model";
import { LetterModel } from "./letter.model";

import Debug from "debug";
const debug = Debug("fixtures");

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
    debug("UN-RELATE LETTER ELEMENT TYPES");
    await LetterTypeModel.relatedQuery("elementTypes", transaction)
      .for(await asFindQuery().select("id"))
      .unrelate();

    debug("DELETE LETTER MODELS");
    await LetterModel.query(transaction)
      .delete()
      .whereIn("letterTypeId", asFindQuery().select("id"));
  }
}
