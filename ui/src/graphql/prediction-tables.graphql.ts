import gql from "graphql-tag";

export const ALL_PREDICTION_TABLES_QUERY = gql`
  query PredictionTableSummary {
    predictionTables {
      id
      title
      description
      surveyLetter {
        isActive
        isFrozen
        survey {
          title
        }
      }
    }
  }
`;

export const ONE_PREDICTION_TABLE_QUERY = gql`
  query OneTable($predictionTableId: Int!) {
    predictionTable(id: $predictionTableId) {
      id
      title
      description
      entries {
        sequence
        practice {
          id
          title
          description
          sequence
        }
        surveyIndex {
          id
          abbreviation
          title
          surveyItems {
            qualtricsId
            qualtricsText
          }
        }
      }
    }
  }
`;
