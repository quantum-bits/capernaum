import { Model } from "objection";
import { SurveyDimensionModel } from "./survey-dimension.model";
import { ScriptureEngagementPracticeModel } from "@common/cli/src/models/scripture-engagement-practice.model";

export class SurveyIndexModel extends Model {
  id!: number;
  surveyDimension: SurveyDimensionModel;
  useForPredictions: boolean;
  abbreviation: string;
  title: string;
  scriptureEngagementPractices: ScriptureEngagementPracticeModel;

  static tableName = "survey_index";

  static relationMappings = () => ({
    scriptureEngagementPractices: {
      modelClass: ScriptureEngagementPracticeModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: "survey_index.id",
        through: {
          from: "prediction_table_entry.surveyIndexId",
          to: "prediction_table_entry.scriptureEngagementPracticeId",
        },
        to: "scripture_engagement_practice.id",
      },
    },
  });
}
