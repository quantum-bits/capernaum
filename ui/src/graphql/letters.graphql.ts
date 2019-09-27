import gql from "graphql-tag";

export const ONE_LETTER_QUERY = gql`
  query oneLetter($letterId: Int!) {
    letter(id: $letterId) {
      id
      name
      isFrozen
    }
  }
`;

export const ALL_LETTERS_QUERY = gql`
  query allLetters {
    letters {
      id
      name
      created
      updated
      isFrozen
    }
  }
`;

export const ADD_LETTER_MUTATION = gql`
  mutation addLetter($name: String!) {
    createLetter(name: $name) {
      id
      name
    }
  }
`;

export const ALL_SURVEY_LETTERS_QUERY = gql`
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
`;

export const ONE_SURVEY_LETTER_QUERY = gql`
  query SurveyLetter($id: Int!) {
    surveyLetter(id: $id) {
      id
      survey {
        id
        qualtricsName
      }
      letter {
        name
        updated
        elements {
          id
          sequence
          letterElementType {
            key
            description
          }
          textDelta
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
