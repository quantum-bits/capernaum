import { Model } from "objection";
import { LetterTypeModel } from "./letter-type.model";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";
import { getDebugger } from "@helpers/debug-factory";
import { LetterElementModel } from "@common/cli/src/models/letter-element.model";

const debug = getDebugger("model:letter-element-type");

export class LetterElementTypeModel extends Model {
  id!: number;
  key: string;
  description: string;
  letterTypes: LetterTypeModel[];

  static tableName = "letter_element_type";

  static relationMappings = () => ({
    letterTypes: {
      modelClass: LetterTypeModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: "letter_element_type.id",
        through: {
          from: "letter_type_letter_element_type.letterElementTypeId",
          to: "letter_type_letter_element_type.letterTypeId",
        },
        to: "letter_type.id",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete letter elements");
    await LetterElementModel.query(transaction)
      .delete()
      .whereIn("letterElementTypeId", asFindQuery().select("id"));
  }
}
