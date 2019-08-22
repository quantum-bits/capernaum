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

export const UPDATE_DIMENSION_MUTATION = gql`
  mutation ChangeDimension($id: Int!, $abbreviation: String!, $title: String!, $sequence: Int!) {
    updateSurveyDimension(
      updateInput: { id: $id, title: $title, abbreviation: $abbreviation, sequence: $sequence }
    ) {
      abbreviation
      title
      sequence
      surveyIndices {
        title
        surveyItems {
          qualtricsText
        }
      }
    }
  }
`;

export const ADD_INDEX_MUTATION = gql`
  mutation AddIndex($dimensionId: Int!, $itemIds: [Int!]!, $title: String!) {
    createSurveyIndex(
      createInput: {
        dimensionId: $dimensionId,
        itemIds: $itemIds,
        title: $title
      }
    ) {
      id
      title
      surveyItems {
        qualtricsText
      }
    }
  }
`;

export const UPDATE_INDEX_MUTATION = gql`
  mutation UpdateIndex($id: Int!, $itemIds: [Int!]!, $title: String!) {
    updateSurveyIndex(
      updateInput: { id: $id, title: $title, itemIds: $itemIds }
    ) {
      id
      title
      surveyItems {
        id
        qualtricsId
        qualtricsText
      }
    }
  }
`;

export const ONE_SURVEY_QUERY = gql`
  query OneSurvey($surveyId: Int!) {
    survey(id: $surveyId) {
      id
      title
      surveyItems {
        id
        sequence
        qualtricsId
        qualtricsText
      }
      surveyDimensions {
        id
        abbreviation
        title
        sequence
        surveyIndices {
          id
          title
          surveyItems {
            id
            qualtricsId
            qualtricsText
          }
        }
      }
    }
  }
`;
