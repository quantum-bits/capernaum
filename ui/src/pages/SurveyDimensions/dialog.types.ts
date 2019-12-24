import {
  SurveyDimensionCreateInput,
  SurveyIndexCreateInput
} from "../../graphql/types/globalTypes";

export interface DimensionDialogState {
  title: string;
}

export type DimensionDialogResponse = Pick<SurveyDimensionCreateInput, "title">;

export interface SurveyItemSelection {
  id: number;
  name: string;
}

export interface IndexDialogState {
  title: string;
  abbreviation: string;
  useForPredictions: boolean;
  selectedItems: SurveyItemSelection[];
}

export type IndexDialogResponse = Omit<SurveyIndexCreateInput, "dimensionId">;
