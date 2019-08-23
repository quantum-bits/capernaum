/** enum for identifying levels in a nested list
 */
export enum SurveyDimensionEnum {
  SURVEY_DIMENSION = "survey-dimension",
  SURVEY_INDEX = "survey-index",
  SURVEY_ITEM = "survey-item"
}

// These interfaces capture the structure of GraphQL data.

export interface SurveyItem {
  id: number;
  sequence: number;
  qualtricsId: string;
  qualtricsText: string;
}

export interface SurveyIndex {
  id: number;
  title: string;
  abbreviation: string;
  surveyItems: SurveyItem[];
}

export interface SurveyDimension {
  id: number;
  title: string;
  sequence: number;
  surveyIndices: SurveyIndex[];
}

export interface Survey {
  id: number;
  title: string;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  surveyItems: SurveyItem[];
  surveyDimensions: SurveyDimension[];
}

// These interfaces represent _views_ of the data in the UI.

export interface SelectedSurveyItem {
  text: string;
  value: number;
}

export interface SurveyItemView {
  id: number;
  name: string;
  type?: string;
}

export interface SurveyIndexView {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  abbrev: string;
  type: string;
  children: SurveyItemView[];
}

export interface SurveyDimensionView {
  id: number;
  name: string;
  type: string;
  children: SurveyIndexView[];
}
