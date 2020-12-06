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
      importedToCapernaum
    }
  }
`;

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
      okayForGroup
      detailedDescription
      letters {
        id
        title
        letterType {
          id
          key
          description
        }
      }
      surveyDimensions {
        id
      }
      surveyItems {
        id
      }
      surveyResponses {
        id
      }
    }
  }
`;

export const IMPORT_QUALTRICS_SURVEY = gql`
  mutation ImportQualtricsSurvey($qualtricsId: String!, $updateOk: Boolean!) {
    importQualtricsSurvey(qualtricsId: $qualtricsId, updateOk: $updateOk) {
      id
      qualtricsId
      qualtricsName
      qualtricsModDate
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
  mutation UpdateIndex($updateInput: SurveyIndexUpdateInput!) {
    updateSurveyIndex(updateInput: $updateInput) {
      id
      title
      abbreviation
      useForPredictions
      surveyItems {
        id
        qualtricsId
        qualtricsText
      }
    }
  }
`;

export const UPDATE_SURVEY_MUTATION = gql`
  mutation UpdateSurvey($updateInput: SurveyUpdateInput!) {
    updateSurvey(updateInput: $updateInput) {
      id
      qualtricsId
      qualtricsName
      qualtricsModDate
      okayForGroup
      detailedDescription
      letters {
        id
        title
        letterType {
          id
          key
          description
        }
      }
      surveyDimensions {
        id
      }
      surveyItems {
        id
      }
      surveyResponses {
        id
      }
    }
  }
`;

export const ONE_SURVEY_QUERY = gql`
  query OneSurvey($surveyId: Int!, $which: WhichItems = All) {
    survey(id: $surveyId) {
      id
      qualtricsName
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

export const DELETE_SURVEY_RESPONSE = gql`
  mutation DeleteSurveyResponse($id: Int!) {
    deleteSurveyResponse(id: $id)
  }
`;

export const DELETE_SURVEY = gql`
  mutation DeleteSurvey($id: Int!) {
    deleteSurvey(id: $id)
  }
`;
