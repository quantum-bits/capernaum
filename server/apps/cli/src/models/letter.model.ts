import { Model } from "objection";
import { LetterElementModel } from "./letter-element.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyModel } from "@common/cli/src/models/survey.model";
import { SurveyLetterModel } from "@common/cli/src/models/survey-letter.model";

const debug = getDebugger("model:letter");

export class LetterModel extends Model {
  id!: number;
  title: string;
  description: string;
  emailMessage: string;
  created: string;
  updated: string;
  surveyLetters: SurveyLetterModel[];
  surveys: SurveyModel[];

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
    surveyLetters: {
      relation: Model.HasManyRelation,
      modelClass: SurveyLetterModel,
      join: {
        from: "letter.id",
        to: "survey_letter.letterId",
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
