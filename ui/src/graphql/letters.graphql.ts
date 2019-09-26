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
