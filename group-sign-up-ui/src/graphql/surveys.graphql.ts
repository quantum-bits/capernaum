import gql from "graphql-tag";

/**
 * Get all surveys in the local database (as opposed to the ones coming from Qualtrics itself)
 * Fetch additional info so we can tell whether other entities refer to this survey.
 */
export const ALL_SURVEYS_QUERY = gql`
  query AllSurveys {
    surveys {
      id
      qualtricsId
      qualtricsName
      qualtricsModDate
      okayForGroup
      publicName
      detailedDescription
    }
  }
`;

export const ADD_GROUP_MUTATION = gql`
  mutation AddGroup($createInput: GroupCreateInput!) {
    createGroup(createInput: $createInput) {
      id
      name
      type
      codeWord
      survey {
        publicName
        qualtricsName
        detailedDescription 
      }
    }
  }
`;
