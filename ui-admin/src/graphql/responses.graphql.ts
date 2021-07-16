import gql from "graphql-tag";

export const SURVEY_RESPONSES_QUERY = gql`
  query SurveyResponses($surveyId: Int!, $groupId: Int) {
    surveyResponses(surveyId: $surveyId, groupId: $groupId) {
      id
      qualtricsResponseId
      email
      startDate
      endDate
      progress
      duration
      finished
      latitude
      longitude
      survey {
        id
        surveyLetters {
          id
          letterType {
            id
            key
            description
          }
        }
      }
    }
  }
`;

export const GROUP_RESPONSES_QUERY = gql`
  query GroupResponses($groupId: Int!) {
    groupResponses: surveyResponsesForGroup(groupId: $groupId) {
      id
      qualtricsResponseId
      email
      survey {
        qualtricsId
        qualtricsName
        surveyLetters {
          letter {
            id
            title
            description
            emailMessage
          }
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
