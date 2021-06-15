export * from "./mean-index-group.view";
export * from "./mean-index-individual.view";

export interface MeanSurveyIndexView {
  meanSurveyIndexId: number; // ID of either a Group or SurveyResponse.
  surveyIndexId: number;
  surveyIndexTitle: string;
  meanSurveyIndex: number;
}
