import gql from "graphql-tag";

export const ALL_SCRIPTURE_ENGAGEMENT_PRACTICES = gql`
  query ScriptureEngagementPractices {
    scriptureEngagementPractices {
      id
      title
      description
      moreInfoUrl
      forPredictionCounts
      surveyIndices {
        id
        title
      }
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
      moreInfoUrl
      forPredictionCounts
    }
  }
`;

export const UPDATE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION = gql`
  mutation UpdateScriptureEngagementPractice(
    $updateData: ScriptureEngagementPracticeUpdateInput!
  ) {
    updateScriptureEngagementPractice(updateData: $updateData) {
      id
      title
      description
      moreInfoUrl
      forPredictionCounts
    }
  }
`;

export const DELETE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION = gql`
  mutation DeleteScriptureEngagementPractice($id: Int!) {
    deleteScriptureEngagementPractice(id: $id)
  }
`;
