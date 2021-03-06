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
          letterType {
            id
            key
            description
          }
        }
      }
      startDate
      endDate
      duration
      finished
    }
  }
`;

export const GROUP_RESPONSES_QUERY = gql`
  query GroupResponses($groupId: Int!) {
    groupResponses: surveyResponses(groupId: $groupId) {
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
          letterType {
            id
            key
            description
          }
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
