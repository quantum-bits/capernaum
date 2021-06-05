import { Model } from "objection";

export class ScriptureEngagementPracticeModel extends Model {
  id!: number;
  title: string;
  description: string;
  moreInfoUrl: string;
  sequence: number;

  static tableName = "scripture_engagement_practice";
}
