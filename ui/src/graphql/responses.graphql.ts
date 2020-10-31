import gql from "graphql-tag";

export const ALL_RESPONSES_QUERY = gql`
  query AllResponses {
    surveyResponses {
      id
      qualtricsResponseId
      email
      survey {
        qualtricsId
        qualtricsName
        letters {
          id
          title
          description
          emailMessage
        }
      }
      startDate
      endDate
      duration
      finished
    }
  }
`;

export const IMPORT_SURVEY_RESPONSES = gql`
  mutation ImportSurveyResponses($qId: String!) {
    importQualtricsSurveyResponses(qualtricsId: $qId) {
      importCount
      duplicateCount
      surveyResponses {
        duration
        email
        qualtricsResponseId
        startDate
        endDate
      }
    }
  }
`;
