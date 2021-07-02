import { Model } from "objection";
import { SurveyIndexModel } from "@common/cli/src/models/survey-index.model";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("model:sep");

export class ScriptureEngagementPracticeModel extends Model {
  id!: number;
  title: string;
  description: string;
  moreInfoUrl: string;
  surveyIndices: SurveyIndexModel[];

  static tableName = "scripture_engagement_practice";

  static relationMappings = () => ({
    surveyIndices: {
      relation: Model.ManyToManyRelation,
      modelClass: SurveyIndexModel,
      join: {
        from: "scripture_engagement_practice.id",
        through: {
          from: "prediction_table_entry.scriptureEngagementPracticeId",
          to: "prediction_table_entry.surveyIndexId",
        },
        to: "survey_index.id",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Un-relate survey indices");
    await ScriptureEngagementPracticeModel.relatedQuery(
      "surveyIndices",
      transaction
    )
      .for(await asFindQuery().select("id"))
      .unrelate();
  }
}
