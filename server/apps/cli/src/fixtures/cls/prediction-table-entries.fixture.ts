import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { PredictionTableEntryModel } from "@common/cli/src/models/prediction-table-entry.model";

const debug = getDebugger("fixture:pte");

export class PredictionTableEntriesFixture extends AbstractFixture {
  delete() {
    debug("Delete prediction table");
    return PredictionTableEntryModel.query().delete();
  }

  insert() {
    debug("Insert prediction table and entries");
    return PredictionTableEntryModel.query().insert(predictionTableEntries);
  }
}

const predictionTableEntries = [
  {
    id: 201,
    surveyIndexId: 88,
    practiceId: 16,
    sequence: 10,
  },
  {
    id: 202,
    surveyIndexId: 88,
    practiceId: 17,
    sequence: 10,
  },
  {
    id: 181,
    surveyIndexId: 73,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 185,
    surveyIndexId: 73,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 193,
    surveyIndexId: 73,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 189,
    surveyIndexId: 79,
    practiceId: 7,
    sequence: 10,
  },
  {
    id: 192,
    surveyIndexId: 79,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 200,
    surveyIndexId: 79,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 186,
    surveyIndexId: 75,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 190,
    surveyIndexId: 75,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 194,
    surveyIndexId: 75,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 195,
    surveyIndexId: 75,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 198,
    surveyIndexId: 75,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 180,
    surveyIndexId: 76,
    practiceId: 1,
    sequence: 10,
  },
  {
    id: 182,
    surveyIndexId: 76,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 188,
    surveyIndexId: 76,
    practiceId: 6,
    sequence: 10,
  },
  {
    id: 197,
    surveyIndexId: 76,
    practiceId: 11,
    sequence: 10,
  },
  {
    id: 183,
    surveyIndexId: 78,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 184,
    surveyIndexId: 78,
    practiceId: 3,
    sequence: 10,
  },
  {
    id: 196,
    surveyIndexId: 78,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 187,
    surveyIndexId: 74,
    practiceId: 5,
    sequence: 10,
  },
  {
    id: 191,
    surveyIndexId: 74,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 199,
    surveyIndexId: 74,
    practiceId: 13,
    sequence: 10,
  },
];
