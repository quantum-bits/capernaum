import { QualtricsListSubscriptions_qualtricsListSubscriptions } from "@/graphql/types/QualtricsListSubscriptions";

export type CategoryType = "controlpanel" | "surveyengine";
export type SubscriptionType =
  | "activateSurvey"
  | "deactivateSurvey"
  | "completedResponse";

export interface QualtricsSubscription
  extends QualtricsListSubscriptions_qualtricsListSubscriptions {
  categoryType: CategoryType;
  subscriptionType: SubscriptionType;
  surveyId?: string;
  url: {
    protocol: string;
    hostname: string;
    path: string;
  };
}
