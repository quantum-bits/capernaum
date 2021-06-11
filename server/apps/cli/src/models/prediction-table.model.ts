import { Model } from "objection";
import { PredictionTableEntryModel } from "./prediction-table-entry.model";
import { getDebugger } from "@helpers/debug-factory";
import { LetterElementModel } from "./letter-element.model";

const debug = getDebugger("model:pt");

export class PredictionTableModel extends Model {
  id!: number;
  name: string;
  predictionTableEntries: PredictionTableEntryModel[];
  letterElements: LetterElementModel[];

  static tableName = "prediction_table";

  static relationMappings = () => ({
    predictionTableEntries: {
      modelClass: PredictionTableEntryModel,
      relation: Model.HasManyRelation,
      join: {
        from: "prediction_table.id",
        to: "prediction_table_entry.predictionTableId",
      },
    },
  });

  static async beforeDelete({ asFindQuery, transaction }) {
    debug("Delete PTEs");
    await PredictionTableEntryModel.query(transaction)
      .delete()
      .whereIn("predictionTableId", asFindQuery().select("id"));
  }
}
