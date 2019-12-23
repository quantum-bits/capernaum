import {
  SurveyDimensionCreateInput,
  SurveyIndexCreateInput
} from "../../graphql/types/globalTypes";

export type DimensionDialogResponse = Pick<SurveyDimensionCreateInput, "title">;

export interface SurveyItemSelection {
  id: number;
  name: string;
}

export interface IndexDialogInitialState {
  title: string;
  abbreviation: string;
  useForPredictions: boolean;
  availableItems: SurveyItemSelection[];
  selectedItems: number[];
}

export type IndexDialogResponse = Omit<SurveyIndexCreateInput, "dimensionId">;
