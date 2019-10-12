import gql from "graphql-tag";

/*export const ONE_LETTER_QUERY = gql`
  query OneLetter($letterId: Int!) {
    letter(id: $letterId) {
      id
      name
      isFrozen
    }
  }
`;*/

/* export const ALL_LETTERS_QUERY = gql`
  query AllLetters {
    letters {
      id
      name
      created
      updated
      isFrozen
    }
  }
`; */

export const ADD_LETTER_MUTATION = gql`
  mutation AddLetter($name: String!) {
    createLetter(name: $name) {
      id
      name
    }
  }
`;


/*export const ALL_SURVEY_LETTERS_QUERY = gql`
  query SurveyLetters {
    surveyLetters {
      id
      survey {
        qualtricsName
      }
      letter {
        name
        updated
      }
      isActive
      isFrozen
    }
  }
`;*/

export const ONE_LETTER_QUERY = gql`
  query OneLetter($letterId: Int!) {
    letter(id: $letterId) {
      id
      description
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

export const ALL_LETTERS_QUERY = gql`
  query AllLetters {
    letters {
      id
      description
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




export const ONE_SURVEY_LETTER_QUERY = gql`
  query OneSurveyLetter($id: Int!) {
    surveyLetter(id: $id) {
      id
      survey {
        id
        qualtricsName
      }
      letter {
        id
        name
        updated
        elements {
          id
          sequence
          letterElementType {
            key
            description
          }
          textDelta {
            ops {
              insert
            }
          }
        }
      }
      isActive
      isFrozen
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
