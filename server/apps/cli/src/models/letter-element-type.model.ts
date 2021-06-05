import { Model } from "objection";
import { LetterTypeModel } from "./letter-type.model";

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
}
