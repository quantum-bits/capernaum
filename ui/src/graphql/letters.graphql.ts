import gql from "graphql-tag";

export const ADD_LETTER_MUTATION = gql`
  mutation AddLetter($title: String!) {
    createLetter(title: $title) {
      id
      title
    }
  }
`;

export const ONE_LETTER_QUERY = gql`
  query OneLetter($letterId: Int!) {
    letter(id: $letterId) {
      id
      title
      description
      scriptureEngagementPractices {
        id
        title
        description
        sequence
      }
      tableEntries {
        surveyIndex {
          id
          abbreviation
          title
          surveyItems {
            qualtricsId
            qualtricsText
          }
        }
        practice {
          id
        }
      }
      letterElements {
        letterElementType {
          key
          description
        }
        sequence
      }
      survey {
        qualtricsId
        qualtricsName
        surveyDimensions {
          survey {
            qualtricsName
          }
          id
          sequence
          title
          useForPredictions
          surveyIndices {
            id
            abbreviation
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
  }
`;

export const ALL_LETTERS_QUERY = gql`
  query Letters {
    letters {
      id
      title
      description
      scriptureEngagementPractices {
        id
        title
        description
        sequence
      }
      tableEntries {
        surveyIndex {
          abbreviation
          title
          surveyItems {
            qualtricsId
            qualtricsText
          }
        }
      }
      letterElements {
        letterElementType {
          key
          description
        }
        sequence
      }
      survey {
        title
        qualtricsId
        qualtricsName
        surveyDimensions {
          survey {
            qualtricsName
          }
          sequence
          title
          useForPredictions
          surveyIndices {
            abbreviation
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
  }
`;


export const ALL_LETTER_ELEMENT_TYPES_QUERY = gql`
  query LetterElementTypes {
    letterElementTypes {
      key
      description
    }
  }
`;
