import gql from "graphql-tag";

export const RESPONSES_SUMMARY_QUERY = gql`
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
      surveyItemResponses {
        surveyItem {
          qualtricsId
          qualtricsText
        }
        label
        value
      }
    }
  }
`;
