import { Model } from "objection";
import { LetterTypeModel } from "./letter-type.model";
import { LetterElementModel } from "./letter-element.model";
import { PredictionTableEntryModel } from "./prediction-table-entry.model";

export class LetterModel extends Model {
  id!: number;
  title: string;
  description: string;
  emailMessage: string;
  created: string;
  updated: string;
  isFrozen: boolean;
  // survey: Survey
  letterType: LetterTypeModel;

  static tableName = "letter";

  static async beforeDelete({ asFindQuery, transaction }) {
    await LetterElementModel.query(transaction)
      .delete()
      .whereIn("letterId", asFindQuery().select("id"));

    await PredictionTableEntryModel.query(transaction)
      .delete()
      .whereIn("letterId", asFindQuery().select("id"));
  }
}
