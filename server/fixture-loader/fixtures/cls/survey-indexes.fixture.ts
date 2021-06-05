import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { SurveyIndexModel } from "../../models/survey-index.model";

const debug = getDebugger("idx");

export class SurveyIndexesFixture extends AbstractFixture {
  delete() {
    debug("Delete survey indexes");
    return SurveyIndexModel.query().delete();
  }

  insert() {
    debug("Insert survey indexes");
    return SurveyIndexModel.query().insert(surveyIndexes);
  }
}

const surveyIndexes = [
  {
    id: 88,
    surveyDimensionId: 26,
    abbreviation: "Christian",
    title: "Christian",
    useForPredictions: true,
  },
  {
    id: 73,
    surveyDimensionId: 27,
    abbreviation: "Centered on God",
    title: "Centered on God",
    useForPredictions: true,
  },
  {
    id: 79,
    surveyDimensionId: 28,
    abbreviation: "Service",
    title: "Service",
    useForPredictions: true,
  },
  {
    id: 80,
    surveyDimensionId: 29,
    abbreviation: "Appetite Discipline",
    title: "Appetite Discipline",
    useForPredictions: false,
  },
  {
    id: 75,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Centered on the Bible",
    useForPredictions: true,
  },
  {
    id: 76,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Connected",
    useForPredictions: true,
  },
  {
    id: 77,
    surveyDimensionId: 28,
    abbreviation: "Evangelistic",
    title: "Evangelistic",
    useForPredictions: false,
  },
  {
    id: 78,
    surveyDimensionId: 28,
    abbreviation: "Reflective",
    title: "Reflective",
    useForPredictions: true,
  },
  {
    id: 81,
    surveyDimensionId: 29,
    abbreviation: "Stewardship",
    title: "Stewardship",
    useForPredictions: false,
  },
  {
    id: 82,
    surveyDimensionId: 30,
    abbreviation: "Affective",
    title: "Affective",
    useForPredictions: false,
  },
  {
    id: 83,
    surveyDimensionId: 30,
    abbreviation: "Experience God",
    title: "Experience God",
    useForPredictions: true,
  },
  {
    id: 84,
    surveyDimensionId: 30,
    abbreviation: "Identity",
    title: "Identity",
    useForPredictions: false,
  },
  {
    id: 85,
    surveyDimensionId: 30,
    abbreviation: "Intellect",
    title: "Intellect",
    useForPredictions: false,
  },
  {
    id: 86,
    surveyDimensionId: 30,
    abbreviation: "Personal Application",
    title: "Personal Application",
    useForPredictions: false,
  },
  {
    id: 74,
    surveyDimensionId: 27,
    abbreviation: "Centered on Others",
    title: "Centered on Others",
    useForPredictions: true,
  },
  {
    id: 87,
    surveyDimensionId: 30,
    abbreviation: "Societal Application",
    title: "Societal Application",
    useForPredictions: true,
  },
];
