/** Identify levels in a nested list */
export enum SurveyDimensionEnum {
  SURVEY_DIMENSION = "survey-dimension",
  SURVEY_INDEX = "survey-index",
  SURVEY_ITEM = "survey-item",
}

/**
 * used when fetching survey items; this enum parallels one defined in the server-side code
 */
export enum WhichItems {
  ALL = "All",
  WITH_INDEX = "WithIndex",
  WITHOUT_INDEX = "WithoutIndex",
}

// These interfaces represent _views_ of the data in the UI.

export interface SurveySelection {
  text: string;
  value: number;
}

export interface SurveyQueryVariables {
  surveyId: number;
  which: string;
}

export interface QualtricsSurveySelection {
  text: string;
  value: string;
}

export interface SurveyItemView {
  id: number;
  name: string;
  type?: string;
}

export interface SurveyIndexView {
  id: number;
  name: string;
  type: string;
  abbreviation: string;
  useForPredictions: boolean;
  dimensionId: number;
  dimensionName: string;
  children: SurveyItemView[];
  canDelete: boolean;
}

export interface SurveyDimensionView {
  id: number;
  name: string;
  type: string;
  children: SurveyIndexView[];
  canDelete: boolean;
}
