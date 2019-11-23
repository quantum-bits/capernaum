import gql from "graphql-tag";

export const RESPONSE_SUMMARY_QUERY = gql`
  query ResponseSummary {
    surveyResponses {
      id
      qualtricsResponseId
      email
      survey {
        qualtricsName
      }
      startDate
      endDate
      duration
      finished
    }
  }
`;

export const ONE_RESPONSE_DETAIL_QUERY = gql`
  query ResponseDetails($id: Int!) {
    surveyResponse(id: $id) {
      id
      email
      progress
      qualtricsResponseId
      survey {
        id
        surveyDimensions {
          id
          title
          useForPredictions
          surveyIndices {
            title
            abbreviation
            predictionTableEntries {
              practice {
                id
                title
              }
            }
            surveyItems {
              qualtricsId
              qualtricsText
              surveyItemResponse(responseId: $id) {
                value
                label
              }
            }
          }
        }
      }
    }
  }
`;

export const IMPORT_SURVEY_RESPONSES = gql`
  mutation ImportSurveyResponses($qId: String!) {
    importQualtricsSurveyResponses(qualtricsId: $qId) {
      duration
      email
      qualtricsResponseId
      startDate
      endDate
    }
  }
`;
