import { Model } from "objection";
import { SurveyIndexModel } from "./survey-index.model";
import { ScriptureEngagementPracticeModel } from "./scripture-engagement-practice.model";
import { PredictionTableModel } from "@common/cli/src/models/prediction-table.model";

export class PredictionTableEntryModel extends Model {
  id!: number;
  surveyIndex: SurveyIndexModel;
  practice: ScriptureEngagementPracticeModel;
  predictionTable: PredictionTableModel;
  sequence: number;

  static tableName = "prediction_table_entry";

  static relationMappings = () => ({
    surveyIndex: {
      modelClass: SurveyIndexModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "prediction_table_entry.surveyIndexId",
        to: "survey_index.id",
      },
    },
    practice: {
      modelClass: ScriptureEngagementPracticeModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "prediction_table_entry.practiceId",
        to: "scripture_engagement_practice.id",
      },
    },
    predictionTable: {
      modelClass: PredictionTableModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "prediction_table_entry.predictionTableId",
        to: "prediction_table.id",
      },
    },
  });
}
