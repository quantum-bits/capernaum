import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { SurveyDimensionModel } from "../../models/survey-dimension.model";

const debug = getDebugger("dim");

export class SurveyDimensionsFixture extends AbstractFixture {
  delete() {
    debug("Delete survey dimensions");
    return SurveyDimensionModel.query().delete();
  }

  insert() {
    debug("Insert survey dimensions");
    const dim = surveyDimensions.map((elt) => ({ ...elt, surveyId: 22 }));
    return SurveyDimensionModel.query().insert(dim);
  }
}

const surveyDimensions = [
  {
    id: 26,
    surveyId: 10,
    title: "Additional",
    sequence: 10,
  },
  {
    id: 27,
    surveyId: 10,
    title: "Centers",
    sequence: 10,
  },
  {
    id: 28,
    surveyId: 10,
    title: "Ways of life",
    sequence: 10,
  },
  {
    id: 29,
    surveyId: 10,
    title: "Disciplines",
    sequence: 10,
  },
  {
    id: 30,
    surveyId: 10,
    title: "Bible engagement",
    sequence: 10,
  },
];
