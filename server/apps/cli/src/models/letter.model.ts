import { Model } from "objection";
import { LetterTypeModel } from "./letter-type.model";
import { LetterElementModel } from "./letter-element.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyModel } from "@common/cli/src/models/survey.model";

const debug = getDebugger("model:letter");

export class LetterModel extends Model {
  id!: number;
  title: string;
  description: string;
  emailMessage: string;
  created: string;
  updated: string;
  isFrozen: boolean;
  surveys: SurveyModel[];
  letterType: LetterTypeModel;

  static tableName = "letter";

  static relationMappings = {
    surveys: {
      relation: Model.ManyToManyRelation,
      modelClass: SurveyModel,
      join: {
        from: "letter.id",
        through: {
          from: "survey_letter.letterId",
          to: "survey_letter.surveyId",
        },
        to: "survey.id",
      },
    },
  };

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Un-relate surveys");
    await LetterModel.relatedQuery("surveys", transaction)
      .for(await asFindQuery().select("id"))
      .unrelate();

    debug("Delete letter elements");
    await LetterElementModel.query(transaction)
      .delete()
      .whereIn("letterId", asFindQuery().select("id"));
  }
}
