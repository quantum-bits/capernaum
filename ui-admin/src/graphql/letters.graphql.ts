import gql from "graphql-tag";

export const ADD_LETTER_MUTATION = gql`
  mutation AddLetter($createInput: LetterCreateInput!) {
    createLetter(createInput: $createInput) {
      id
      title
      description
    }
  }
`;

export const CREATE_SURVEY_LETTER = gql`
  mutation CreateSurveyLetter($input: SurveyLetterCreateInput!) {
    createSurveyLetter(surveyLetterCreateInput: $input) {
      id
      letter {
        id
        created
        description
        letterElements {
          id
        }
      }
      letterType {
        id
        key
        description
      }
      survey {
        id
        qualtricsName
      }
    }
  }
`;

export const UPDATE_LETTER_MUTATION = gql`
  mutation UpdateLetter($letterData: LetterUpdateInput!) {
    updateLetter(letterData: $letterData) {
      id
      title
      description
      emailMessage
    }
  }
`;

export const DELETE_LETTER_MUTATION = gql`
  mutation DeleteLetter($id: Int!) {
    deleteLetter(id: $id)
  }
`;

export const ONE_LETTER_QUERY = gql`
  query OneLetter($letterId: Int!) {
    letter(id: $letterId) {
      id
      title
      updated
      description
      emailMessage
      surveyLetters {
        survey {
          id
          qualtricsName
        }
        letterType {
          id
          key
          description
          letterElementTypes {
            id
            key
            description
          }
        }
      }
      letterElements {
        letterElementType {
          id
          key
          description
        }
        id
        sequence
        textDelta
        surveyDimension {
          id
          title
        }
        image {
          id
          title
          url
        }
      }
    }
  }
`;

export const ALL_LETTERS_QUERY = gql`
  query AllLetters {
    letters {
      id
      title
      description
      updated
      surveyLetters {
        survey {
          id
          qualtricsName
        }
        letterType {
          id
          key
          description
          letterElementTypes {
            id
            key
            description
          }
        }
      }
      letterElements {
        letterElementType {
          id
          key
          description
        }
        id
        sequence
        textDelta
        surveyDimension {
          id
          title
        }
      }
    }
  }
`;

export const ALL_LETTER_TYPES_QUERY = gql`
  query ReadLetterTypes {
    readLetterTypes {
      id
      key
      description
    }
  }
`;

export const ALL_LETTER_ELEMENT_TYPES_QUERY = gql`
  query LetterElementTypes {
    letterElementTypes {
      id
      key
      description
    }
  }
`;

export const CREATE_LETTER_ELEMENT_MUTATION = gql`
  mutation CreateLetterElement($createInput: LetterElementCreateInput!) {
    createLetterElement(createInput: $createInput) {
      id
      sequence
      image {
        id
        title
        url
      }
      surveyDimension {
        id
        title
      }
      textDelta
      letterElementType {
        id
        key
        description
      }
    }
  }
`;

export const UPDATE_LETTER_ELEMENT_MUTATION = gql`
  mutation UpdateLetterElement($updateInput: LetterElementUpdateInput!) {
    updateLetterElement(updateInput: $updateInput) {
      id
      sequence
    }
  }
`;

export const DELETE_LETTER_ELEMENT_MUTATION = gql`
  mutation DeleteLetterElement($id: Int!) {
    deleteLetterElement(id: $id)
  }
`;

export const WRITE_LETTER_MUTATION = gql`
  mutation WriteLetter($writerInput: WriterInput!) {
    writeLetter(writerInput: $writerInput) {
      ok
      message
      pdfFileName
      pdfAbsolutePath
      pdfRelativePath
      responseSummary {
        id
        date
        email
        qualtricsResponseId
        surveySummary {
          id
          title
          qualtricsId
          qualtricsName
        }
        dimensionSummaries {
          id
          title
          indexSummaries {
            id
            title
            abbreviation
            meanResponse
            itemSummaries {
              id
              qualtricsId
              qualtricsText
              responseId
              responseLabel
              responseValue
            }
          }
        }
        predictionSummaries {
          practiceSummary {
            id
            title
          }
          predictionDetails {
            surveyIndexTitle
            surveyIndexAbbreviation
            meanResponse
          }
          predict
        }
      }
    }
  }
`;

export const SEND_LETTER_MUTATION = gql`
  mutation SendLetter($mailInput: SendMailInput!) {
    sendLetter(mailInput: $mailInput) {
      accepted
      rejected
      messageId
      envelope {
        from
        to
      }
    }
  }
`;

export const RESEQUENCE_LETTER_ELEMENTS = gql`
  mutation Resequence($letterElementIds: [Int!]!) {
    resequenceLetterElements(letterElementIds: $letterElementIds) {
      id
      sequence
      letterElementType {
        id
        key
      }
    }
  }
`;

export const LETTER_ELEMENT_DETAILS = gql`
  query LetterElementsByType {
    allLetterTypes: letterElementTypes {
      id
      key
      description
    }
    elementsByLetterType: readLetterTypes {
      id
      key
      description
      letterElementTypes {
        id
        key
        description
      }
    }
  }
`;

export const LETTERS_AND_SURVEYS = gql`
  query LettersForSurveys {
    letterTypes: readLetterTypes {
      id
      key
      description
    }
    surveys {
      id
      qualtricsName
      importedDate
    }
  }
`;
