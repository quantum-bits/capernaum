import { Model } from "objection";

export class SurveyModel extends Model {
  id!: number;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  emailKey: string;
  groupCodeKey: string;
  okayForGroup: boolean;
  detailedDescription: string;
  publicName: string;

  static tableName = "survey";
}
