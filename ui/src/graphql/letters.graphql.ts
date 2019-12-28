import gql from "graphql-tag";

export const ADD_LETTER_MUTATION = gql`
  mutation AddLetter($createInput: LetterCreateInput!) {
    createLetter(createInput: $createInput) {
      id
      title
      description
      updated
      isFrozen
    }
  }
`;

export const UPDATE_LETTER_MUTATION = gql`
  mutation UpdateLetter($letterData: LetterUpdateInput!) {
    updateLetter(letterData: $letterData) {
      id
      title
      description
      updated
      isFrozen
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
      isFrozen
      emailMessage
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
          sequence
        }
        image {
          id
          title
          url
        }
      }
      survey {
        id
        title
        qualtricsId
        qualtricsName
        surveyDimensions {
          survey {
            qualtricsName
          }
          id
          sequence
          title
          surveyIndices {
            id
            abbreviation
            title
            useForPredictions
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
      updated
      isFrozen
      scriptureEngagementPractices {
        id
        title
        description
        sequence
      }
      tableEntries {
        id
        surveyIndex {
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
          sequence
        }
      }
      survey {
        id
        title
        qualtricsId
        qualtricsName
        surveyDimensions {
          id
          survey {
            qualtricsName
          }
          sequence
          title
          surveyIndices {
            abbreviation
            title
            useForPredictions
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
  mutation WriteLetter($letterWriterInput: LetterWriterInput!) {
    writeLetter(letterWriterInput: $letterWriterInput) {
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
            title
            abbreviation
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
    sendLetter(mailInput: $mailInput)
  }
`;
