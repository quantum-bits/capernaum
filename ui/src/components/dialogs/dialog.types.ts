import {
  SurveyDimensionCreateInput,
  SurveyIndexCreateInput
} from "../../graphql/types/globalTypes";
import { SubscriptionType } from "@/types/qualtrics.types";

export type DimensionDialogResponse = Pick<SurveyDimensionCreateInput, "title">;

export interface SurveyItemSelection {
  id: number;
  name: string;
}

export type IndexDialogResponse = Omit<
  SurveyIndexCreateInput,
  "surveyDimensionId"
>;

export interface SubscriptionDialogResponse {
  hostName: string;
  subscriptionType: SubscriptionType;
  surveyId: string;
}
