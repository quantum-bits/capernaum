import gql from "graphql-tag";

/* export const REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION = gql`
  mutation ReplacePredictionTableEntries($replaceInput: replaceInput) {
    replacePredictionTableEntries(
      replaceInput: { surveyId: $surveyId, title: $title, sequence: $sequence, useForPredictions: $useForPredictions }
    ) {
      id
      title
      sequence
      useForPredictions
      surveyIndices {
        title
        abbreviation
        surveyItems {
          qualtricsId
          qualtricsText
        }
      }
    }
  }
`; */