import {
  SurveyDimensionCreateInput,
  SurveyIndexCreateInput
} from "../../graphql/types/globalTypes";

export type DimensionDialogResponse = Pick<SurveyDimensionCreateInput, "title">;

export interface SurveyItemSelection {
  id: number;
  name: string;
}

export type IndexDialogResponse = Omit<SurveyIndexCreateInput, "dimensionId">;
