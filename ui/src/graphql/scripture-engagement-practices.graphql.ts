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

export const ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION = gql`
  mutation AddScriptureEngagementPractice(
    $createInput: ScriptureEngagementPracticeCreateInput!
  ) {
    createScriptureEngagementPractice(createInput: $createInput) {
      id
      title
      description
      sequence
    }
  }
`;
