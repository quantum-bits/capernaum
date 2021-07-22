import {
  SurveyIndexCreateInput,
  SurveyUpdateInput,
} from "@/graphql/types/globalTypes";
import { SubscriptionType } from "@/types/qualtrics.types";

export type SurveyDialogResponse = Omit<SurveyUpdateInput, "id">;

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

export enum DialogMode {
  Noop,
  Create,
  Update,
  Delete,
}
