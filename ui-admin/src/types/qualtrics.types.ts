import { QualtricsListSubscriptions_subscriptions } from "@/graphql/types/QualtricsListSubscriptions";

export type CategoryType = "controlpanel" | "surveyengine";

export type SubscriptionType =
  | "activate-survey"
  | "deactivate-survey"
  | "started-session"
  | "partial-response"
  | "completed-response";

export interface EnhancedSubscription
  extends QualtricsListSubscriptions_subscriptions {
  categoryType: CategoryType;
  subscriptionType: SubscriptionType;
  surveyId?: string;
  url: {
    protocol: string;
    hostname: string;
    path: string;
  };
}
