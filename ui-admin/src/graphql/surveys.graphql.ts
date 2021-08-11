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
      capernaumSurvey {
        id
      }
    }
  }
`;

export const ALL_CAPERNAUM_SURVEYS = gql`
  query AllCapernaumSurveys {
    surveys {
      id
      qualtricsId
      qualtricsName
      qualtricsModDate
      okayForGroup
      publicName
      detailedDescription
      importedDate
      groups {
        id
        name
      }
      surveyLetters {
        letter {
          id
          title
        }
        letterType {
          id
          key
          description
        }
      }
      surveyItems {
        id
        qualtricsText
      }
      surveyDimensions {
        id
        title
        surveyIndices {
          id
          title
          abbreviation
          useForPredictions
          surveyItems {
            id
            qualtricsText
          }
          scriptureEngagementPractices {
            id
            title
          }
        }
      }
    }
  }
`;

export const COMBINED_SURVEYS_QUERY = gql`
  query CombinedSurveys {
    combinedSurveys: qualtricsSurveys(includeInactive: true) {
      qualtricsId
      qualtricsOwnerId
      qualtricsName
      qualtricsModDate
      qualtricsIsActive
      qualtricsCreationDate
      capernaumSurvey {
        id
        importedDate
      }
    }
  }
`;

export const IMPORT_QUALTRICS_SURVEY = gql`
  mutation ImportQualtricsSurvey($qualtricsId: String!) {
    importQualtricsSurvey(qualtricsId: $qualtricsId) {
      id
      importedDate
      qualtricsId
      qualtricsName
      qualtricsModDate
      surveyItems {
        id
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
      surveyIndices {
        id
        title
        abbreviation
        useForPredictions
        scriptureEngagementPractices {
          id
          title
          description
        }
        surveyItems {
          id
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
    surveyIndexCreate(createInput: $createInput) {
      id
      title
      abbreviation
      useForPredictions
      scriptureEngagementPractices {
        id
        title
        description
      }
      surveyItems {
        id
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

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($updateInput: SurveyUpdateInput!) {
    updateSurvey(updateInput: $updateInput) {
      id
      qualtricsId
      qualtricsName
      qualtricsModDate
      okayForGroup
      publicName
      detailedDescription
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
        qualtricsId
        qualtricsText
      }
      surveyDimensions {
        id
        title
        surveyIndices {
          id
          title
          abbreviation
          useForPredictions
          scriptureEngagementPractices {
            id
            title
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

export const UPDATE_ASSOCIATION_TABLE = gql`
  mutation UpdateAssociationTable($updates: [AssociationUpdateInput!]!) {
    updateBooleanAssociations(updates: $updates) {
      id
      title
      scriptureEngagementPractices {
        id
        title
      }
    }
  }
`;

export const SURVEY_LETTERS_QUERY = gql`
  query SurveyLetters($id: Int) {
    surveyLetters(id: $id) {
      id
      survey {
        id
        qualtricsName
        importedDate
        surveyDimensions {
          id
          title
          surveyIndices {
            id
            abbreviation
            title
          }
        }
      }
      letter {
        id
        title
        updated
        description
        emailMessage
        letterElements {
          id
          letterElementType {
            id
            key
            description
          }
          sequence
          textDelta
          image {
            id
            title
            url
          }
          surveyDimension {
            id
            title
          }
        }
      }
      letterType {
        id
        key
        description
      }
    }
  }
`;
