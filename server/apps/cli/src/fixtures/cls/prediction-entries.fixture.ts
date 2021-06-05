import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { PredictionTableEntryModel } from "../../models/prediction-table-entry.model";

const debug = getDebugger("fixture:pte");

export class PredictionEntriesFixture extends AbstractFixture {
  delete() {
    debug("Delete prediction table entries");
    return PredictionTableEntryModel.query().delete();
  }

  insert() {
    debug("Insert prediction table entries");
    return PredictionTableEntryModel.query().insert(predictionTableEntries);
  }
}

const predictionTableEntries = [
  {
    id: 201,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 16,
    sequence: 10,
  },
  {
    id: 202,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 17,
    sequence: 10,
  },
  {
    id: 181,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 185,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 193,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 189,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 7,
    sequence: 10,
  },
  {
    id: 192,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 200,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 186,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 190,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 194,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 195,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 198,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 180,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 1,
    sequence: 10,
  },
  {
    id: 182,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 188,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 6,
    sequence: 10,
  },
  {
    id: 197,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 11,
    sequence: 10,
  },
  {
    id: 183,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 184,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 3,
    sequence: 10,
  },
  {
    id: 196,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 187,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 5,
    sequence: 10,
  },
  {
    id: 191,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 199,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 13,
    sequence: 10,
  },
];
