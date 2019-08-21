import gql from "graphql-tag";

export const ALL_QUALTRICS_SURVEYS_QUERY = gql`
  query QualtricsSurveys($includeInactive: Boolean) {
    qualtricsSurveys(includeInactive: $includeInactive) {
      qualtricsId
      qualtricsOwnerId
      qualtricsName
      qualtricsModDate
      qualtricsIsActive
      qualtricsCreationDate
    }
  }
`;

/**
 * this query is for getting all of the surveys that are saved in the local database (as opposed to the ones coming from Qualtrics itself)
 */
export const ALL_SURVEYS_QUERY = gql`
  query Surveys {
    surveys {
      id
      title
      qualtricsId
      qualtricsName
      qualtricsModDate
    }
  }  
`;

export const IMPORT_QUALTRICS_SURVEY = gql`
  mutation ImportQualtricsSurvey($qualtricsImportInput: QualtricsImportInput!) {
    importQualtricsSurvey(importInput: $qualtricsImportInput) {
      id
      title
      surveyItems {
        qualtricsText
      }
    }
  }
`;

export const ADD_DIMENSION_MUTATION = gql`
  mutation AddDimension($surveyId: Int!, $abbreviation: String!, $title: String!, $sequence: Int!) {
    createSurveyDimension(
      createInput: {
        surveyId: $surveyId
        abbreviation: $abbreviation
        title: $title
        sequence: $sequence
      }
    ) {
      abbreviation
      id
      title
      surveyIndices {
        title
        surveyItems {
          qualtricsId
          qualtricsText
        }
      }
    }
  }
`;


const a = gql`
  query {
    survey(id: 42) {
      items {
        id
        name
      }
    }
  }
`;

const b = gql`
  query {
    surveyDimension {
      id
      name
      surveyIndex {
        id
        name
        surveyItem {
          id
          name
        }
      }
    }
  }
`;
