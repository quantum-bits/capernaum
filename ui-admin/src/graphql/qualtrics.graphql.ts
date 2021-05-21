import gql from "graphql-tag";

export const QUALTRICS_ORG_QUERY = gql`
  query QualtricsOrganization {
    organization {
      id
      name
      status
      creationDate
    }
  }
`;

export const QUALTRICS_LIST_SUBSCRIPTIONS = gql`
  query QualtricsListSubscriptions {
    subscriptions {
      id
      topics
      publicationUrl
      successfulCalls
      encrypted
      scope
    }
  }
`;

export const QUALTRICS_REMOVE_SUBSCRIPTION = gql`
  mutation QualtricsRemoveSubscription($subscriptionId: String!) {
    deleteSubscription(subscriptionId: $subscriptionId)
  }
`;

export const QUALTRICS_CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($createInput: QualtricsSubscriptionCreateInput!) {
    createSubscription(createInput: $createInput) {
      id
      scope
      topics
      publicationUrl
      encrypted
      successfulCalls
    }
  }
`;
