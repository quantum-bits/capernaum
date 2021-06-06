import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { SurveyModel } from "../../models/survey.model";

const debug = getDebugger("fixture:survey");

export class SurveysFixture extends AbstractFixture {
  delete() {
    debug("Delete survey");
    return SurveyModel.query().delete();
  }

  insert(update) {
    debug("Insert survey");
    return SurveyModel.query().insert(surveys);
  }
}

const surveys = [
  {
    id: 38,
    qualtricsId: "SV_0NyRAwZoSOSKPoW",
    qualtricsName: "CLS Spring 2020 Copy",
    qualtricsModDate: "2021-05-26T15:50:45Z",
    emailKey: "QID2_TEXT",
    groupCodeKey: "QID3_TEXT",
    okayForGroup: true,
    detailedDescription: "Capernaum test fixture survey",
    publicName: "Capernaum Test Survey",
  },
];
