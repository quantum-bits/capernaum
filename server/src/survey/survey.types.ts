// Used to filter which survey items are retrieved for a survey.

import { ScriptureEngagementPractice } from "../prediction/entities";
import { SurveyIndex } from "./entities";

export enum WhichItems {
  All,
  WithIndex,
  WithoutIndex
}

export interface ChartEntry {
  title: string;
  value: number;
}

export interface ChartData {
  title: string;
  entries: ChartEntry[];
}

export interface PredictionDetails {
  title: string;
  abbreviation: string;
  meanResponse: number;
}

export interface Prediction {
  practice: ScriptureEngagementPractice;
  details: PredictionDetails[];
  predict: boolean;
}
