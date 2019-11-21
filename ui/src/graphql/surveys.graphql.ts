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
      importedAs {
        id
      }
    }
  }
`;

/**
 * this query is for getting all of the surveys that are saved in the local database (as opposed to the ones coming from Qualtrics itself)
 */
export const ALL_SURVEYS_QUERY = gql`
  query AllSurveys {
    surveys {
      id
      title
      qualtricsId
      qualtricsName
      qualtricsModDate
      letters {
        id
      }
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
  mutation AddDimension(
    $surveyId: Int!
    $title: String!
    $sequence: Int!
    $useForPredictions: Boolean!
  ) {
    createSurveyDimension(
      createInput: {
        surveyId: $surveyId
        title: $title
        sequence: $sequence
        useForPredictions: $useForPredictions
      }
    ) {
      id
      title
      sequence
      useForPredictions
      surveyIndices {
        title
        abbreviation
        surveyItems {
          qualtricsId
          qualtricsText
        }
      }
    }
  }
`;

export const UPDATE_DIMENSION_MUTATION = gql`
  mutation ChangeDimension(
    $id: Int!
    $title: String!
    $sequence: Int!
    $useForPredictions: Boolean!
  ) {
    updateSurveyDimension(
      updateInput: {
        id: $id
        title: $title
        sequence: $sequence
        useForPredictions: $useForPredictions
      }
    ) {
      title
      sequence
      useForPredictions
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
  mutation AddIndex(
    $dimensionId: Int!
    $itemIds: [Int!]!
    $title: String!
    $abbreviation: String!
  ) {
    createSurveyIndex(
      createInput: {
        dimensionId: $dimensionId
        itemIds: $itemIds
        title: $title
        abbreviation: $abbreviation
      }
    ) {
      id
      title
      abbreviation
      surveyItems {
        qualtricsText
      }
    }
  }
`;

export const UPDATE_INDEX_MUTATION = gql`
  mutation UpdateIndex(
    $id: Int!
    $itemIds: [Int!]!
    $title: String!
    $abbreviation: String!
  ) {
    updateSurveyIndex(
      updateInput: {
        id: $id
        title: $title
        abbreviation: $abbreviation
        itemIds: $itemIds
      }
    ) {
      id
      title
      abbreviation
      surveyItems {
        id
        qualtricsId
        qualtricsText
      }
    }
  }
`;

export const ONE_SURVEY_QUERY = gql`
  query OneSurvey($surveyId: Int!, $which: WhichItems = All) {
    survey(id: $surveyId) {
      id
      title
      surveyItems(whichItems: $which) {
        id
        sequence
        qualtricsId
        qualtricsText
      }
      surveyDimensions {
        id
        title
        sequence
        useForPredictions
        surveyIndices {
          id
          title
          abbreviation
          predictionTableEntries {
            id
          }
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

export const DELETE_DIMENSION = gql`
  mutation TossSurveyDimension($id: Int!) {
    deleteSurveyDimension(id: $id) {
      deletedDimensionId
      deletedIndexIds
      deletedItemIds
    }
  }
`;

export const DELETE_INDEX = gql`
  mutation TossSurveyIndex($id: Int!) {
    deleteSurveyIndex(id: $id) {
      deletedIndexId
      deletedItemIds
    }
  }
`;
