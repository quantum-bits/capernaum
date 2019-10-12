import gql from "graphql-tag";

export const ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY = gql`
  query ScriptureEngagementPractices {
    scriptureEngagementPractices {
      id
      title
      description
      sequence
    }
  }
`;
