/** enum for identifying levels in a nested list
 */
export enum SurveyDimensionEnum {
  SURVEY_DIMENSION = "survey-dimension",
  SURVEY_INDEX = "survey-index",
  SURVEY_ITEM = "survey-item",
}

/**
 * data format for surveys
 */
export interface SurveyItem {
  id: string; // id of the survey in our db
  ownerId: string;
  name: string;
  isActive: boolean;
  lastModified: string;
  creationDate: string;
  __typename: string;
}

/**
 * format for survey selections in drop-down menus
 */
export interface SurveySelection {
  text: string;
  value: number;
}

