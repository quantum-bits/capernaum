import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { SurveyDimensionModel } from "../../models/survey-dimension.model";

const debug = getDebugger("fixture:survey-dim");

export class SurveyDimensionsFixture extends AbstractFixture {
  delete() {
    debug("Delete survey dimensions");
    return SurveyDimensionModel.query().delete();
  }

  insert(update) {
    debug("Insert survey dimensions");
    return SurveyDimensionModel.query().insert(
      this.updateFromOptions(surveyDimensions, update)
    );
  }
}

const surveyDimensions = [
  {
    id: 26,
    surveyId: 38,
    title: "Additional",
  },
  {
    id: 27,
    surveyId: 38,
    title: "Centers",
  },
  {
    id: 28,
    surveyId: 38,
    title: "Ways of life",
  },
  {
    id: 29,
    surveyId: 38,
    title: "Disciplines",
  },
  {
    id: 30,
    surveyId: 38,
    title: "Bible engagement",
  },
];
