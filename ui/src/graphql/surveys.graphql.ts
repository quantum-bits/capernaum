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
        title
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
  mutation AddDimension($createInput: SurveyDimensionCreateInput!) {
    createSurveyDimension(createInput: $createInput) {
      id
      title
      sequence
      surveyIndices {
        title
        abbreviation
        useForPredictions
        surveyItems {
          qualtricsId
          qualtricsText
        }
      }
    }
  }
`;

export const UPDATE_DIMENSION_MUTATION = gql`
  mutation UpdateDimension($updateInput: SurveyDimensionUpdateInput!) {
    updateSurveyDimension(updateInput: $updateInput) {
      title
      sequence
      surveyIndices {
        title
        useForPredictions
        surveyItems {
          qualtricsText
        }
      }
    }
  }
`;

export const ADD_INDEX_MUTATION = gql`
  mutation AddIndex($createInput: SurveyIndexCreateInput!) {
    createSurveyIndex(createInput: $createInput) {
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
        surveyIndices {
          id
          title
          abbreviation
          useForPredictions
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
