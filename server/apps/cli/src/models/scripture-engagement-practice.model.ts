import { Model } from "objection";
import { SurveyIndexModel } from "@common/cli/src/models/survey-index.model";

export class ScriptureEngagementPracticeModel extends Model {
  id!: number;
  title: string;
  description: string;
  moreInfoUrl: string;
  surveyIndices: SurveyIndexModel;

  static tableName = "scripture_engagement_practice";
}
