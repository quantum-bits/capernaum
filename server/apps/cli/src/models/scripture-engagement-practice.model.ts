import { Model } from "objection";
import { PredictionTableEntryModel } from "@common/cli/src/models/prediction-table-entry.model";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("fixture:sep");

export class ScriptureEngagementPracticeModel extends Model {
  id!: number;
  title: string;
  description: string;
  moreInfoUrl: string;
  sequence: number;

  static tableName = "scripture_engagement_practice";

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete PTE's");
    await PredictionTableEntryModel.query(transaction)
      .delete()
      .whereIn("practiceId", asFindQuery().select("id"));
  }
}
