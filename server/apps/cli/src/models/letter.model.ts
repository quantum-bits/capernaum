import { Model } from "objection";
import { LetterTypeModel } from "./letter-type.model";
import { LetterElementModel } from "./letter-element.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";

const debug = getDebugger("model:letter");

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
    debug("Delete survey letters");
    await SurveyLetterModel.query(transaction)
      .delete()
      .whereIn("letterId", asFindQuery().select("id"));

    debug("Delete letter elements");
    await LetterElementModel.query(transaction)
      .delete()
      .whereIn("letterId", asFindQuery().select("id"));
  }
}
