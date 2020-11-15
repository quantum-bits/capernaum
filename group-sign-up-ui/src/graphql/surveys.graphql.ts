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
    }
  }
`;
