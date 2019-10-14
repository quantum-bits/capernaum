import gql from "graphql-tag";

export const REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION = gql`
  mutation ReplacePredictionTableEntries(
    $replaceInput: PredictionTableEntryReplaceInput!
  ) {
    replacePredictionTableEntries(replaceInput: $replaceInput) {
      id
      letter {
        id
      }
      surveyIndex {
        id
        abbreviation
        title
      }
      practice {
        id
        title
        sequence
        description
      }
      sequence
    }
  }
`;
