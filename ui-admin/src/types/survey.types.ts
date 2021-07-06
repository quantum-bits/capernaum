export interface SurveyItem {
  sequence: number;
  qualtricsId: string;
  qualtricsText: string;
}

export interface SurveyIndex {
  surveyItems: SurveyItem[];
  abbreviation: string;
  title: string;
}

export interface SurveyDimension {
  surveyIndices: SurveyIndex[];
  title: string;
  sequence: number;
}

// FIXME - Stop using this entire file.
export interface Survey {
  surveyDimensions: SurveyDimension[];
  title: string;
  qualtricsName: string;
}
